import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Data } from './Data';
import { Auth } from './Auth';
import { Filestore } from './Filestore';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class HasuraExampleApp extends React.Component {

  render() {
    return (
      <MuiThemeProvider>
        <Router>
          <div>
            <Route exact path="/" render={() =>
                <div>
                  <h1>Welcome to react app</h1>
                  <h4>Navigate to /auth to check out a simple implementation of authentication</h4>
                  <h4>Navigate to /data to see how data can be queried from tables to be used in your app</h4>
                  <h4>Navigate to /filestore to upload files</h4>
                </div>
              }/>
            <Route exact path="/data" component={Data}/>
            <Route exact path="/auth" component={Auth}/>
            <Route exact path="/filestore" component={Filestore}/>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default HasuraExampleApp;
