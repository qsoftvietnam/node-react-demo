//=== import the common packages ===
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory, hashHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import {Provider} from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
//=== import internal ===
import * as pages from './containers';
import {FetchHelper} from './middle/src/services';
import store from './store';

class App {
  // constructor: this is function to setup default states & call to the init functions
  constructor() {
    this.state = {
        history: syncHistoryWithStore(hashHistory, store)
    }
    // call init function of Material
    this.initMaterial();
    // call init function
    this.init();
  }

  // init: this is function using to initial initialization for system
  init() {
    ReactDOM.render(
      <Provider store={store}>
          {this.routes()}
      </Provider>,
      document.getElementById('root') // root is a element in html. we are using it to contain all element after react dom generated.
    );
  }

  // initMaterial: this is function using initial Material package to use: grid, menu, icons, dialog ...
  initMaterial() {
      injectTapEventPlugin();
  }

  // parserAuth: this is function to check authenticate & apply the direct with the cases
  parserAuth(nextState, replace) {
    let auth = JSON.parse(localStorage.getItem('auth'));

    // set token if user authenticated
    if (auth) {
      FetchHelper.token = auth.token;
    }
    // redirect to login if authentication is faild
    if (!auth) {
      browserHistory.push('/#/');
    }
  }

  // routes: this is function contain all route of system. each route will mapping with each pages
  routes() {
    return (
    <Router history={this.state.history}>
      <Route path="/" component={pages.Login}/>
      <Route path="login" component={pages.Login} />
      <Route path="patient" component={pages.PatientList} onEnter={this.parserAuth()}/>
      <Route path="patient/create" component={pages.PatientForm} onEnter={this.parserAuth()}/>
      <Route path="patient/:patientId" component={pages.PatientForm} onEnter={this.parserAuth()}/>
    </Router>
    );
  }
}

new App();
