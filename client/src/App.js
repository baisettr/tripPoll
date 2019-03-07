import React, { Component } from 'react';
import { Route, Switch, Redirect, Link, withRouter } from 'react-router-dom';
import './App.css';
import Home from './containers/Home';
import Final from './containers/Final';
import Propose from './containers/Propose';
import Select from './containers/Select';
import View from './containers/View';
import NavBar from './containers/Navbar';
import Iconbar from './containers/Iconbar';
import Login from './containers/Login';
import Logout from './containers/Logout';

//const Login = React.lazy(() => import('./containers/Login'));

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { userAuth: false, userToken: null };
  }

  componentDidMount() {
    const userExpiration = new Date(localStorage.getItem('userExpiration'));
    const userSetTimeout = userExpiration.getTime() - new Date().getTime();
    this.authCheckState();
    setTimeout(this.authCheckState, userSetTimeout);
  }

  authCheckState = () => {
    const userExpiration = new Date(localStorage.getItem('userExpiration'));
    if (userExpiration > new Date()) {
      const userToken = localStorage.getItem('userToken');
      const userAuth = true;
      //const userName = JSON.parse(window.atob(userToken.split('.')[1])).userName;
      this.setState({ userAuth, userToken });
    } else {
      const userAuth = false;
      localStorage.removeItem('userExpiration');
      localStorage.removeItem('userToken');
      this.setState({ userAuth });
    }
  }

  HomeComponent = (props) => {
    return (
      <div className="jumbotron container divHome">
        <h4>Trip Poll - Plan before you ride!</h4>
        <br />
        <img src="./logo1.jpg" alt="logo" style={{ width: "350px" }}></img>
        <br /><br /><br /><br />
        <div >
          <Link to="/login"><button className="btn btn-dark" >Proceed to Login</button></Link>
        </div>
      </div>)
  }

  FooterComponent = () => {
    return (
      <div className="footer">
        <span className="copyright">Copyright © <a href="https://rkbeavs.me">Rama Krishna Baisetti</a>. 2019 • All rights reserved.</span>
        <span className="support">Than You for visting us! Please <a href="mailto:baisettr@oregonstate.edu">contact</a> for support</span>
      </div>
    )
  }

  HandleLoginComponent = () => {
    return (
      <div className="jumbotron container divHome">
        <h4>Trip Poll - Plan before you ride!</h4>
        <h6>Please <Link to="/login">Login</Link></h6>
      </div>)
  }

  LogoutChangeHandler = (e) => {
    this.setState({ userAuth: e });
  }

  LoginChangeHandler = (e) => {
    const userExpiration = new Date(localStorage.getItem('userExpiration'));
    const userSetTimeout = userExpiration.getTime() - new Date().getTime();
    setTimeout(this.authCheckState, userSetTimeout);
    this.setState({ userAuth: e });
  }

  RouteComponent = () =>
    <React.Fragment>{this.state.userAuth ?
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/dashboard" component={Home} />
        <Route path="/final" component={Final} />
        <Route path="/propose" component={Propose} />
        <Route path="/select" component={Select} />
        <Route path="/view" component={View} />
        <Route path="/logout" render={(props) => <Logout logoutChange={this.LogoutChangeHandler} />} />
        <Route render={() => <Home />} />
        {/* <Redirect to="/" /> */}
      </Switch>
      :
      <Switch>
        <Route exact path="/" component={this.HomeComponent} />
        <Route path="/login" render={(props) => <Login loginChange={this.LoginChangeHandler} />} />
        <Redirect from="/logout" to="/login" />
        <Route render={() => <Login loginChange={this.LoginChangeHandler} />} />
      </Switch>}
    </React.Fragment>

  render() {
    return (
      <React.Fragment>
        <NavBar status={this.state.userAuth} />
        <this.RouteComponent />
        <this.FooterComponent />
        <Iconbar status={this.state.userAuth} />
      </React.Fragment>
    );
  }
}

/*  FullComponent = () =>
   <Switch>
     <Route path="/" exact component={this.HomeComponent} />
     <Route path="/dashboard" render={() => <Home auth={this.state} />} />
     <Route path="/final" component={Final} />
     <Route path="/propose" component={Propose} />
     <Route path="/select" component={Select} />
     <Route path="/view" component={View} />
     <Route path="/login" component={Login} />
     <Route path="/login" render={() => (<Suspense fallback={<div>Loading...</div>}><Login /></Suspense>)} />
     <Route render={() => <h1>404 Authorizing an invalid url!</h1>} />
     <Redirect from="/" to="/login" />
   </Switch > */

export default withRouter(App);
