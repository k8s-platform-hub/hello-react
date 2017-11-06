import React from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import LinearProgress from 'material-ui/LinearProgress';
import {Card, CardText} from 'material-ui/Card';
import { saveOffline, getSavedToken } from './config';
import { authenticateUser } from './api';


const textfieldStyle = {
  width: 300
}

class Auth extends React.Component {

  constructor() {
    super()
    this.state = {
      username: '',
      password: '',
      showLoadingIndicator: false,
      showAlert: false,
      alertMessage: ''
    };
  }

  showProgressIndicator = (shouldShow) => {
    this.setState({
      ...this.state,
      showLoadingIndicator: shouldShow
    });
  }

  login = () => {
    console.log('on login clicked');
    this.showProgressIndicator(true)
    authenticateUser(this.state.username, this.state.password, false).then(authResponse => {
      this.showProgressIndicator(false)
      console.log(authResponse);
      if (authResponse.auth_token) {
        //Save the auth token offline to be used by the filestore service
        saveOffline(authResponse.auth_token)
        this.showAlert("Login Successful! \n Your auth credentials are: " + JSON.stringify(authResponse, null, 2));
      } else {
        this.showAlert(JSON.stringify(authResponse));
      }
    });
  }

  register = () => {
    console.log('on register clicked');
    this.showProgressIndicator(true)
    authenticateUser(this.state.username, this.state.password, true).then(authResponse => {
      this.showProgressIndicator(false)
      console.log(authResponse);
      if (authResponse.auth_token) {
        saveOffline(authResponse.auth_token)
        this.showAlert("SignUp Successful! \n Your auth credentials are: " + JSON.stringify(authResponse, null, 2))
      } else {
        this.showAlert(JSON.stringify(authResponse));
      }
    });
  }

  handleUsernameChange = (e) => {
    this.setState({
      ...this.state,
      username: e.target.value
    });
  }

  handlePasswordChange = (e) => {
    this.setState({
      ...this.state,
      password: e.target.value
    });
  }

  closeAlert = () => {
    this.setState({
      ...this.state,
      showAlert: false,
      alertMessage: ''
    });
  };

  showAlert = (message) => {
    this.setState({
      ...this.state,
      showAlert: true,
      alertMessage: message
    });
  }


  render() {
    const styleObj = {
      height: '350px',
      width: '500px',
      margin: '20px',
      textAlign: 'center',
      display: 'inline-block',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)'
    };

    const buttonContainerStyle = {
      position: 'absolute',
      bottom: '20px',
      width: '100%',
      textAlign: 'center'
    };

    return (
      <div>
        <Paper
          style={styleObj}
          zDepth={1}>
          {this.state.showLoadingIndicator ? <LinearProgress mode="indeterminate" /> : null}

          <Subheader>Authentication</Subheader>
          <Divider/>

          <TextField
            onChange={this.handleUsernameChange}
            floatingLabelText="Username"
            style={textfieldStyle}
            hintText="Username"/>

          <TextField
            onChange={this.handlePasswordChange}
            floatingLabelText="Password"
            style={textfieldStyle}
            type="password"
            hintText="password"/>

          <div style={buttonContainerStyle}>
            <FlatButton
              label="Login"
              primary={true}
              onClick= {(e) => {
                this.login()
              }}/>
            <FlatButton
              label="Register"
              onClick= {(e) => {
                this.register()
              }} />
          </div>

        </Paper>
        <Dialog
          actions={[
            <FlatButton
              label="Dismiss"
              secondary={true}
              onClick={this.closeAlert}
            />
          ]}
          modal={false}
          open={this.state.showAlert}
          onRequestClose={this.closeAlert}>
          {this.state.alertMessage}
        </Dialog>
        <Card>
          <CardText>
            This is a basic implementation of authentication using the auth apis provided by Hasura. While hasura provides various types of authentication like username/password, email/password, mobile/otp, google, facebook etc. This examples utilizes the username/password authentication.
            To view the code for this component, check out services/ui/app/src/hasuraExamples/Auth.js
          </CardText>
        </Card>
      </div>
    )
  }
}

export {
  Auth
};
