import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import './App.css';
import Place from './containers/Place';
import Options from './containers/Options';
import Propose from './containers/Propose';
import Select from './containers/Select';
import View from './containers/View';
import { Label } from 'react-bootstrap';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h2><Label>Trip Poll</Label></h2>
        <button className="btn btn-link"><Link to="/propose">Propose a Trip</Link></button>
        <button className="btn btn-link"><Link to="/view">View a Trip</Link></button>
        <Switch>
          <Route path="/" exact component={Place} />
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
