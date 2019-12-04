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
            isRequesting: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
    }

    async componentDidMount() {
        // Initialize enigma-js client library (including web3)
        const enigma = await getEnigmaInit();
        // Create redux action to initialize set state variable containing enigma-js client library
        this.props.initializeEnigma(enigma);
        // Initialize unlocked accounts
        const accounts = await enigma.web3.eth.getAccounts();
        // Create redux action to initialize set state variable containing unlocked accounts
        this.props.initializeAccounts(accounts);
    }
    
    handleSubmit(event) {
        this.setState({
            isRequesting: true,
        });

        //this.tryRegister(this.state.domainToRegister);
        event.preventDefault();
        alert("Successfully Added")
    }
    handleCheck(event) {
        this.setState({
            isRequesting: true,
        });

        //this.tryRegister(this.state.domainToRegister);
        event.preventDefault();
        alert("ANK PUBKEY")
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
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Add here email and ANK pubkey:
                        <input type="text" value={this.state.email} />
                        <input type="text" value={this.state.pubkey}  />
                    </label>
                    <input type="submit" disabled={this.state.isRequesting} value="Submit" />
                </form>
                <form onSubmit={this.handleCheck}>
                    <label>
                        Email:
                        <input type="text" value={this.state.email} />
                    </label>
                    <input type="submit" disabled={this.state.isRequesting} value="Submit" />
                </form>
              </div>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return { enigma: state.enigma }
};

export default connect(
    mapStateToProps,
    { initializeEnigma, initializeAccounts }
)(withStyles(styles)(App));
