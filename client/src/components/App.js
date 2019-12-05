// Imports - React
import React, { Component } from "react";
// Imports - Redux
import connect from "react-redux/es/connect/connect";
// Imports - Frameworks (Semantic-UI and Material-UI)
import { Container, Message } from "semantic-ui-react";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core";
// Imports - Initialize Enigma
import getEnigmaInit from "../utils/getEnigmaInit.js";
// Imports - Components
import Header from "./Header";
import "../App.css";
// Imports - Actions (Redux)
import { initializeEnigma, initializeAccounts } from '../actions';
import { utils, eeConstants } from 'enigma-js';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            pubkey: "",
            ownerAddress: "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0",
            isRequesting: false,
            contractAddress: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.emailChange = this.emailChange.bind(this);
        this.pukeyChange = this.pukeyChange.bind(this);
        this.componentDidMount()
    }
    sleep = ms => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    splitEmails = decryptedOutput => {
        const decodedParameters = this.props.web3.eth.abi.decodeParameters(
            [
                {
                    type: 'string',
                    name: 'email',
                },
            ],
            decryptedOutput
        )
        const email = decodedParameters.email
        // Return empty array of messages if decrypted output string is empty.
        if (email === '') {
            return []
        }
        // Otherwise return messages.
        const separator = '|'
        return decodedParameters.email.split(separator)
    }
    
    async componentDidMount() {
        // Initialize enigma-js client library (including web3)
        const enigma = await getEnigmaInit();
        enigma.setTaskKeyPair('cupcake');
        // Create redux action to initialize set state variable containing enigma-js client library
        this.props.initializeEnigma(enigma);
        // Initialize unlocked accounts
        const accounts = await enigma.web3.eth.getAccounts();
        // Create redux action to initialize set state variable containing unlocked accounts
        this.props.initializeAccounts(accounts);
        const secretContractCount = await enigma.enigmaContract.methods.countSecretContracts().call();

        this.state.contractAddress = (await enigma.enigmaContract.methods
          .getSecretContractAddresses(secretContractCount - 1, secretContractCount).call())[0];
        console.log(this.state.contractAddress)
        const sender = this.props.accounts[this.props.accountId];
        console.log(sender)
    }
    
    handleSubmit(event) {
        this.setState({
            isRequesting: true,
        });

        //this.tryRegister(this.state.domainToRegister);
        event.preventDefault();
        const taskFn = 'add_email(string,string)';
        const taskArgs = [
          [this.state.email, 'string'],
          [this.state.pubkey, 'string'],
        ];
        const taskGasLimit = 10000000;
        const taskGasPx = utils.toGrains(1e-7);
        this.props.enigma.computeTask(taskFn, taskArgs, taskGasLimit, taskGasPx, this.state.ownerAddress, this.state.contractAddress)
        alert("Successfully Added")
        this.setState({
            isRequesting: false,
        });
    }
    handleCheck = async (event) => {
        this.setState({
            isRequesting: true,
        });

        //this.tryRegister(this.state.domainToRegister);
        event.preventDefault();
        const taskFn = 'check_email(string)';
        const taskArgs = [
          [this.state.email, 'string']
         ];
        const taskGasLimit = 10000000;
        const taskGasPx = utils.toGrains(1e-7);
        console.log(this.state.ownerAddress)
        console.log(this.state.contractAddress)
        
        let task = await new Promise((resolve, reject) => {
            this.props.enigma.computeTask(taskFn, taskArgs, taskGasLimit, taskGasPx, this.state.ownerAddress, this.state.contractAddress)
                .on(eeConstants.SEND_TASK_INPUT_RESULT, (result) => resolve(result))
                .on(eeConstants.ERROR, (error) => reject(error));
        });
        
        while (task.ethStatus === 1) {
            console.log(task)
            // Poll for task record status and finality on Ethereum after worker has finished computation
            task = await this.props.enigma.getTaskRecordStatus(task);
            await this.sleep(1000);
        }
        
        if (task.ethStatus === 2) {
            console.log(task)
            // Decrypt messages
            task = await this.props.enigma.decryptTaskResult(task);
            // // Rebuild messages from concatenated string of task decrypted output.
            const messages = this.splitEmails(task.decryptedOutput);
        } else {
            console.log('Task failed: did not read secret messages')
        }


        
        var result = this.props.enigma.computeTask(taskFn, taskArgs, taskGasLimit, taskGasPx, this.state.ownerAddress, this.state.contractAddress)
        alert("ANK PUBKEY" + result)
        console.log(result)
        result = this.props.enigma.getTaskResult(result)
        console.log(result)
        result = this.props.enigma.decryptTaskResult(result)
        console.log(result)
        console.log(result.decryptedOutput)
        this.setState({
            isRequesting: false,
        });
    }
    emailChange(event) {
        this.setState({
            email: event.target.value
        });
    }
    pukeyChange(event) {
        this.setState({
            pubkey: event.target.value
        });
    }
    
    render() {
        if (!this.props.enigma) {
            return (
                <div className="App">
                    <Header/>
                    <Message color="red">Enigma setup still loading...</Message>
                </div>
            );
        }
        else {
            return (
              <div>
                <div className="App">
                    <Header/>
                    <Message color="green">Enigma setup has loaded!</Message>
                </div>
                <form className="form-inline" onSubmit={this.handleSubmit}>
                    <label>
                        Add here email and ANK pubkey:
                        <input type="text" className="form-control" value={this.state.email} onChange={this.emailChange} />
                        <input type="text" className="form-control" value={this.state.pubkey} onChange={this.pukeyChange} />
                    </label>
                    <input type="submit" className="form-control sbt" disabled={this.state.isRequesting} value="Submit" />
                </form>
                <form className="form-inline" onSubmit={this.handleCheck}>
                    <label>
                        Check Email:
                        <input type="text" className="form-control" value={this.state.email} onChange={this.emailChange} />
                    </label>
                    <input type="submit" className="form-control sbt" disabled={this.state.isRequesting} value="Submit" />
                </form>
              </div>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return { 
        enigma: state.enigma
    }
};

export default connect(
    mapStateToProps,
    { initializeEnigma, initializeAccounts }
)(withStyles(styles)(App));
