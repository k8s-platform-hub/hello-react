import React from 'react';
import { uploadFile } from './api';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import {Card, CardText} from 'material-ui/Card';

import { getSavedToken } from './config';

class Filestore extends React.Component {

  constructor() {
    super()
    this.state = {
      isUploadingFile: false,
      showAlert: false,
      alertMessage: ''
    }
  }

  showProgressIndicator = (shouldShow) => {
    this.setState({
      ...this.state,
      isUploadingFile: shouldShow
    })
  }

  showAlert = (message) => {
    this.setState({
      ...this.state,
      showAlert: true,
      alertMessage: message
    })
  }

  closeAlert = () => {
    this.setState({
      ...this.state,
      showAlert: false,
      alertMessage: ''
    })
  }

  handleFileUpload = (file) => {
    const authToken = getSavedToken();
    if (!authToken) {
      this.showAlert('Please login first. Go to /auth to login');
      return;
    }
    this.showProgressIndicator(true)
    uploadFile(file, authToken).then(response => {
      this.showProgressIndicator(false)
      if (response.file_id) {
        this.showAlert("File uploaded successfully: " + JSON.stringify(response, null, 4));
      } else {
        this.showAlert("File upload failed: " + JSON.stringify(response));
      }
    }).catch(error => {
      console.log('File upload failed: ' + error);
    });
  }

  render() {
    const containerStyle = {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      position: 'fixed',
      padding: '20px'
    }

    return (
      <div>
        <Card>
          <CardText>
            This component utilizes the hasura filestore APIs. In this particular example, you can select a file from your local machine and upload it on hasura. The response will contain information about the upload. You can then open up your api console, navigate to the Filestore section and see that a new entry has been made in the filestore table.
            The hasura filestore is secure by default. You can easily changes these permissions. To know more about filestore permissions visit the docs.
            In this case, the permissions have been set such that only a logged in user can upload and download files. For your file upload to work, ensure that you have logged in by navigating to /auth.
          </CardText>
        </Card>
        <Paper style={containerStyle}>
          <div>
            <input type="file" className="form-control" placeholder="Upload a file"/>
          </div> &nbsp;
          <FlatButton
            label="Upload File"
            secondary={true}
            onClick={(e) => {
              e.preventDefault();
              const input = document.querySelector('input[type="file"]');
              if (input.files[0]) {
                this.handleFileUpload(input.files[0])
              } else {
                this.showAlert("Please select a file")
              }
            }}/>
        </Paper>
        {this.state.isUploadingFile ? <CircularProgress /> : null}
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
      </div>
    )
  }
}

export {
  Filestore
};
