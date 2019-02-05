import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './containers/Home';
import Options from './containers/Options';
import Propose from './containers/Propose';
import Select from './containers/Select';
import View from './containers/View';
import NavBar from './containers/Nav';
import Login from './containers/Login';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/options" component={Options} />
          <Route path="/propose" component={Propose} />
          <Route path="/select" component={Select} />
          <Route path="/view" component={View} />
        </Switch >
      </div>
    );
  }
}

export default App;
