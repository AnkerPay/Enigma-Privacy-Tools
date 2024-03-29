// Imports - React
import React, { Component } from 'react';
// Imports - Redux
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
// Imports - Frameworks (Semantic-UI and Material-UI)
import { Message } from "semantic-ui-react";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import TextField from "@material-ui/core/TextField/TextField";
// Imports - Components
import Notifier, {openSnackbar} from "./Notifier";
// Imports - enigma-js client library utility packages
import { utils, eeConstants } from 'enigma-js';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class DataValidation extends Component {
  constructor(props) {
    super(props);
    this.onAddDataset = this.onAddDataset.bind(this);
    this.onCheckDataset = this.onCheckDataset.bind(this);
    this.state = {
      isPending: false
    };
  }

  // Redux form/material-ui render address select component
  static renderAddressInput({input, label, meta: { touched, error }, children, ...custom }) {
    return (
      <div>
        <FormControl error={touched && error} fullWidth>
          <Select
            native
            {...input}
            {...custom}
            inputProps={{
              name: 'ownerAddress',
              id: 'owner-address'
            }}
            required
          >
            {children}
          </Select>
        </FormControl>
      </div>

    )
  }

  // Redux form/material-ui render net worth text field component
  static renderStringInput({label, input, meta: { touched, invalid, error }, ...custom }) {
    return (
      <TextField
        label={label}
        type="text"
        placeholder={label}
        error={touched && invalid}
        helperText={touched && error}
        {...input}
        {...custom}
        fullWidth
      />
    )
  }

  // Redux form callback when add dataset info is submitted
  async onAddDataset({ ownerAddress, ankaddress, email } ) {
    // Create compute task metadata
    // computeTask(
    //      fn - the signature of the function we are calling (Solidity-types, no spaces)
    //      args - the args passed into our method w/ format [[arg_1, type_1], [arg_2, type_2], …, [arg_n, type_n]]
    //      gasLimit - ENG gas units to be used for the computation task
    //      gasPx - ENG gas price to be used for the computation task in grains format (10⁸)
    //      sender - Ethereum address deploying the contract
    //      scAddr - the secret contract address for which this computation task belongs to
    // )
    console.log(ownerAddress)
    console.log(ankaddress)
    console.log(email)
    console.log(this.props.deployedDataValidation)
    const taskFn = 'add_email(string,string)';
    const taskArgs = [
      [email, 'string'],
      [ankaddress, 'string']
    ];
    const taskGasLimit = 10000000;
    const taskGasPx = utils.toGrains(1e-7);
    console.log('computeTask')
    let task = await new Promise((resolve, reject) => {
      this.props.enigma.computeTask(taskFn, taskArgs, taskGasLimit, taskGasPx, ownerAddress,
        this.props.deployedDataValidation)
        .on(eeConstants.SEND_TASK_INPUT_RESULT, (result) => resolve(result))
        .on(eeConstants.ERROR, (error) => reject(error));
    });
    console.log('wait computeTask')
    this.setState({ isPending: true });
    while (task.ethStatus === 1) {
      // Poll for task record status and finality on Ethereum after worker has finished computation
      task = await this.props.enigma.getTaskRecordStatus(task);
      console.log('waiting')
      await sleep(1000);
    }
    // ethStatus === 2 means task has successfully been computed and commited on Ethereum
    if (task.ethStatus === 2) {
      // Get task result by passing in existing task - obtains the encrypted, abi-encoded output
      task = await new Promise((resolve, reject) => {
        this.props.enigma.getTaskResult(task)
          .on(eeConstants.GET_TASK_RESULT_RESULT, (result) => resolve(result))
          .on(eeConstants.ERROR, (error) => reject(error));
      });
      console.log('ok')
      // Decrypt the task result - obtains the decrypted, abi-encoded output
      task = await this.props.enigma.decryptTaskResult(task);
      // Abi-decode the output to its desired components
      console.log(task)
      openSnackbar({ message: 'Task succeeded: added dataset equal to the previous one' });
    } else {
      openSnackbar({ message: 'Task failed: did not add dataset' });
    }
    this.props.reset('addDataset');
    this.setState({ isPending: false });
  }

  async onCheckDataset({ ownerAddress, email } ) {
    // Create compute task metadata
    // computeTask(
    //      fn - the signature of the function we are calling (Solidity-types, no spaces)
    //      args - the args passed into our method w/ format [[arg_1, type_1], [arg_2, type_2], …, [arg_n, type_n]]
    //      gasLimit - ENG gas units to be used for the computation task
    //      gasPx - ENG gas price to be used for the computation task in grains format (10⁸)
    //      sender - Ethereum address deploying the contract
    //      scAddr - the secret contract address for which this computation task belongs to
    // )
    console.log(ownerAddress)
    console.log(email)
    console.log(this.props.deployedDataValidation)
    const taskFn = 'check_email(string)';
    const taskArgs = [
      [email, 'string'],
    ];
    const taskGasLimit = 10000000;
    const taskGasPx = utils.toGrains(1e-7);
    console.log('computeTask')
    let task = await new Promise((resolve, reject) => {
    this.props.enigma.computeTask(taskFn, taskArgs, taskGasLimit, taskGasPx, ownerAddress,
        this.props.deployedDataValidation)
        .on(eeConstants.SEND_TASK_INPUT_RESULT, (result) => resolve(result))
        .on(eeConstants.ERROR, (error) => {
            console.log(error.message);
            reject(error);
        });
    });
    
    
    // let task = await new Promise((resolve, reject) => {
      // this.props.enigma.computeTask(taskFn, taskArgs, taskGasLimit, taskGasPx, ownerAddress,
        // this.props.deployedDataValidation)
        // .on(eeConstants.SEND_TASK_INPUT_RESULT, (result) => resolve(result))
        // .on(eeConstants.ERROR, (error) => reject(error));
    // });
    this.setState({ isPending: true });
    console.log('wait computeTask')
    while (task.ethStatus === 1) {
      // Poll for task record status and finality on Ethereum after worker has finished computation
      task = await this.props.enigma.getTaskRecordStatus(task);
      console.log('waiting')
      await sleep(1000);
    }
    // ethStatus === 2 means task has successfully been computed and commited on Ethereum
    if (task.ethStatus === 2) {
      // Get task result by passing in existing task - obtains the encrypted, abi-encoded output
      task = await new Promise((resolve, reject) => {
        this.props.enigma.getTaskResult(task)
          .on(eeConstants.GET_TASK_RESULT_RESULT, (result) => resolve(result))
          .on(eeConstants.ERROR, (error) => reject(error));
      });
      console.log('ok')
      // Decrypt the task result - obtains the decrypted, abi-encoded output
      task = await this.props.enigma.decryptTaskResult(task);
      // Abi-decode the output to its desired components
      const ankaddress = this.props.enigma.web3.eth.abi.decodeParameters([{
        type: 'string',
        name: 'ankaddress',
      }], task.decryptedOutput).ankaddress;

      console.log(task)
      console.log(ankaddress)
      openSnackbar({ message: 'Task succeeded: added dataset equal to the previous one' });
    } else {
      openSnackbar({ message: 'Task failed: did not add dataset' });
    }
    this.props.reset('checkDataset');
    this.setState({ isPending: false });
  }
  render() {
    if (this.props.deployedDataValidation === null) {
      return (
        <div>
          <Message color="red">Anker Privacy secret contract not yet deployed...</Message>
        </div>
      )
    }
    return (
      <div>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div>
              <Notifier />
              <h4>Enter Dataset</h4>
              <form onSubmit={this.props.handleSubmit(this.onAddDataset)}>
                <div>
                  <InputLabel htmlFor="owner-address">Address *</InputLabel>
                  <Field
                    name="ownerAddress"
                    component={DataValidation.renderAddressInput}
                  >
                    <option value="" />
                    {this.props.accounts.map((account, i) => {
                      return (
                        <option key={i} value={account}>{account}</option>
                      );
                    })}
                  </Field>
                </div>
                <div>
                  <Field
                    name="ankaddress"
                    component={DataValidation.renderStringInput}
                    label="ankaddress"
                    required
                  />
                </div>
                <div>
                  <Field
                    name="email"
                    type="email"
                    component={DataValidation.renderStringInput}
                    label="Email"
                    required
                  />
                </div>
                <br />
                <div>
                  <Button
                    variant='outlined'
                    type='submit'
                    disabled={this.state.isPending}
                    color='secondary'>
                    {this.state.isPending ? 'Pending...' : 'Submit'}
                  </Button>
                </div>
              </form>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div>
              <Notifier />
              <h4>Enter Dataset</h4>
              <form onSubmit={this.props.handleSubmit(this.onCheckDataset)}>
                <div>
                  <InputLabel htmlFor="owner-address">Address *</InputLabel>
                  <Field
                    name="ownerAddress"
                    component={DataValidation.renderAddressInput}
                  >
                    <option value="" />
                    {this.props.accounts.map((account, i) => {
                      return (
                        <option key={i} value={account}>{account}</option>
                      );
                    })}
                  </Field>
                </div>
                <div>
                  <Field
                    name="email"
                    type="email"
                    component={DataValidation.renderStringInput}
                    label="Email"
                    required
                  />
                </div>
                <br />
                <div>
                  <Button
                    variant='outlined'
                    type='submit'
                    disabled={this.state.isPending}
                    color='secondary'>
                    {this.state.isPending ? 'Pending...' : 'Submit'}
                  </Button>
                </div>
              </form>
            </div>
          </Grid>
        </Grid>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    enigma: state.enigma,
    accounts: state.accounts,
    deployedDataValidation: state.deployedDataValidation,
  }
};
export default connect(mapStateToProps)(reduxForm({
  form: 'addDataset',
  form: 'checkDataset',
})(DataValidation));
