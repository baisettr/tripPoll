import React, { Component, Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import Home from './containers/Home';
import Options from './containers/Options';
import Propose from './containers/Propose';
import Select from './containers/Select';
import View from './containers/View';
import NavBar from './containers/Nav';
import Login from './containers/Login';

const Login = React.lazy(() => import('./containers/Login'));

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <NavBar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/options" component={Options} />
          <Route path="/propose" component={Propose} />
          <Route path="/select" component={Select} />
          <Route path="/view" component={View} />
          <Route path="/login" render={() => (<Suspense fallback={<div>Loading...</div>}><Login /></Suspense>)} />
          {/* <Route render={() => <h1>404 Authorizing an invalid url!</h1>} /> */}
          <Redirect from="/" to="/login" />
        </Switch >
      </React.Fragment>
    );
  }
}

export default App;
