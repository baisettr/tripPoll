import React, { Component, Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import Home from './containers/Home';
import Options from './containers/Options';
import Propose from './containers/Propose';
import Select from './containers/Select';
import View from './containers/View';
import NavBar from './containers/Navbar';
import Login from './containers/Login';
import Logout from './containers/Logout';

//const Login = React.lazy(() => import('./containers/Login'));

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { userAuth: false, userToken: null };
  }

  componentDidMount() {
    this.authCheckState();
  }

  authCheckState = () => {
    const userAuth = localStorage.getItem('userAuth');
    const userToken = localStorage.getItem('userToken');
    if (userToken !== null && userAuth === 'true') {
      this.setState({ userAuth, userToken });
    }
  }

  HomeComponent = (props) => {
    return (
      <div className="jumbotron container divHome">
        <h4>Trip Poll - Plan before you ride!</h4>
      </div>)
  }

  LogoutChangeHandler = (e) => {
    this.setState({ userAuth: e });
  }

  LoginChangeHandler = (e) => {
    this.setState({ userAuth: e });
  }

  RouteComponent = () =>
    <React.Fragment>{this.state.userAuth ?
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/dashboard" component={Home} />
        <Route path="/options" component={Options} />
        <Route path="/propose" component={Propose} />
        <Route path="/select" component={Select} />
        <Route path="/view" component={View} />
        <Route path="/logout" render={(props) => <Logout logoutChange={this.LogoutChangeHandler} />} />
        <Redirect to="/" />
      </Switch>
      :
      <Switch>
        <Route path="/" exact component={this.HomeComponent} />
        <Route path="/login" render={(props) => <Login loginChange={this.LoginChangeHandler} />} />
        <Redirect from="/" to="/login" />
      </Switch>}
    </React.Fragment>

  FullComponent = () =>
    <Switch>
      <Route path="/" exact component={this.HomeComponent} />
      <Route path="/dashboard" render={() => <Home auth={this.state} />} />
      <Route path="/options" component={Options} />
      <Route path="/propose" component={Propose} />
      <Route path="/select" component={Select} />
      <Route path="/view" component={View} />
      <Route path="/login" component={Login} />
      {/* <Route path="/login" render={() => (<Suspense fallback={<div>Loading...</div>}><Login /></Suspense>)} />
   <Route render={() => <h1>404 Authorizing an invalid url!</h1>} />  */}
      <Redirect from="/" to="/login" />
    </Switch >

  render() {
    return (
      <React.Fragment>
        <NavBar status={this.state.userAuth} />
        <this.RouteComponent />
      </React.Fragment>
    );
  }
}

export default App;
