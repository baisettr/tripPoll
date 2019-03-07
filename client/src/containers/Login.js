import React, { Component } from 'react';
import axios from 'axios';
import { withRouter, Link } from 'react-router-dom';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { isSignedIn: false, userName: "", userEmail: "", userId: "", userPassword: "", error: '', userDetails: {}, actionStep: 0, loadSpin: false };
    }

    userSignIn = (e) => {
        e.preventDefault();
        this.setState({ loadSpin: true });
        const userEmail = this.state.userEmail;
        const userPassword = this.state.userPassword;
        const userCredentials = { userEmail, userPassword };
        const url = '/userSignIn';
        axios.post(url, { data: userCredentials }
        ).then((res) => {
            //console.log(res.data.userClient);
            const userToken = res.data.userClient.token;
            const userExpiration = new Date(new Date().getTime() + 59 * 60 * 1000);
            const userId = res.data.userClient.userId;
            const userName = res.data.userClient.userName;
            localStorage.setItem('userExpiration', userExpiration);
            localStorage.setItem('userToken', userToken);
            localStorage.setItem('userId', userId);
            localStorage.setItem('userName', userName);
            //this.props.history.push('/', this.state)
            this.setState({ isSignedIn: true });
            this.props.loginChange(true);
        }).catch((error) => {
            const message = error.response.data.message || "Internal error. Please try again later!";
            this.setState({ error: message, loadSpin: false });
        });
    }

    userSignUp = (e) => {
        e.preventDefault();
        this.setState({ loadSpin: true });
        const userId = Math.round(1000000 + Math.random() * 1000000, 5);
        const userName = this.state.userName;
        const userEmail = this.state.userEmail;
        const userPassword = this.state.userPassword;
        const userDetails = { userId, userName, userEmail, userPassword, userTrips: [], userResponses: [] };
        const url = '/userSignUp';
        axios.post(url, { data: userDetails }
        ).then((res) => {
            const userToken = res.data.userClient.token;
            const userExpiration = new Date(new Date().getTime() + 59 * 60 * 1000);
            const userId = res.data.userClient.userId;
            localStorage.setItem('userExpiration', userExpiration);
            localStorage.setItem('userToken', userToken);
            localStorage.setItem('userName', userName);
            localStorage.setItem('userId', userId);
            this.setState({ isSignedIn: true });
            this.props.loginChange(true);
        }).catch((error) => {
            const message = error.response.data.message || "Internal error. Please try again later!";
            this.setState({ error: message, loadSpin: false });
        });
    }

    userDetails = (e) => {
        e.preventDefault();
        const userToken = localStorage.userToken;
        const headers = { Authorization: 'Bearer ' + userToken };
        const url = '/userDetails';
        axios.get(url, { headers }
        ).then((res) => {
            //console.log(res.data);
        }).catch((error) => {
            //console.log(error.response.data);
        });
    }

    SignUpShowHandler = (e) => {
        e.preventDefault();
        this.setState({ actionStep: 1 });
    }
    SignInShowHandler = (e) => {
        e.preventDefault();
        this.setState({ actionStep: 0 });
    }

    LoginForm = () =>
        <div >
            <form onSubmit={this.userSignIn} >
                <div className="form-group" style={{ textAlign: "left" }}>
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email" className="form-control" defaultValue={this.state.userEmail} onChange={(e) => { this.setState({ userEmail: e.target.value, error: "" }) }} placeholder="enter email" required={true} id="exampleInputEmail1" aria-describedby="emailHelp" />
                </div>
                <div className="form-group" style={{ textAlign: "left" }}>
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" className="form-control" defaultValue={this.state.userPassword} onChange={(e) => { this.setState({ userPassword: e.target.value, error: "" }) }} placeholder="enter password" required={true} id="exampleInputPassword1" />
                </div>
                <button className="btn btn-dark">Sign in</button>
            </form>
        </div>

    LoginCardComponent = () =>
        <div className="cardLogin">
            <div className="card-title h4">Sign in Trip Poll!</div>
            <div className="card-body">
                <h6 style={{ color: 'red' }}>{this.state.error}</h6>
                {this.state.loadSpin ? <this.SpinComponent /> : <this.LoginForm />}
                <br />
                <h6>Please <a href="/#" onClick={this.SignUpShowHandler.bind(this)}>Sign up</a> if you don't have an account</h6>
            </div>

            <br /><br />
            <h6>Proceed to <Link to="/">Home</Link></h6>
        </div>

    SignUpForm = () =>
        <div >
            <form onSubmit={this.userSignUp} >
                <div className="form-group" style={{ textAlign: "left" }}>
                    <label htmlFor="inputName">Full Name</label>
                    <input type="text" className="form-control" defaultValue={this.state.userName} onChange={(e) => { this.setState({ userName: e.target.value, error: "" }) }} placeholder="enter full name" required={true} id="inputName" aria-describedby="nameHelp" />
                </div>
                <div className="form-group" style={{ textAlign: "left" }}>
                    <label htmlFor="inputEmail">Email address</label>
                    <input type="email" className="form-control" defaultValue={this.state.userEmail} onChange={(e) => { this.setState({ userEmail: e.target.value, error: "" }) }} placeholder="enter email" required={true} id="inputEmail" aria-describedby="emailHelp" />
                </div>
                <div className="form-group" style={{ textAlign: "left" }}>
                    <label htmlFor="inputPassword">Password</label>
                    <input type="password" className="form-control" defaultValue={this.state.userPassword} onChange={(e) => { this.setState({ userPassword: e.target.value, error: "" }) }} placeholder="enter password" required={true} id="inputPassword" />
                </div>
                <button className="btn btn-dark">Sign up</button>
            </form>
        </div>

    SignUpCardComponent = () =>
        <div className="cardLogin">
            <div className="card-title h4">Sign up Trip Poll!</div>
            <div className="card-body">
                <h6 style={{ color: 'red' }}>{this.state.error}</h6>
                {this.state.loadSpin ? <this.SpinComponent /> : <this.SignUpForm />}
                <br />
                <h6>Please <a href="/#" onClick={this.SignInShowHandler.bind(this)}>Sign in</a> if you already have an account!</h6>
            </div>

            <br /><br />
            <h6>Proceed to <Link to="/">Home</Link></h6>
        </div>

    SpinComponent = () => <div className='Loader'>Loading...</div>

    switchComponent = (e) => {
        switch (e) {
            case 0: return <this.LoginCardComponent />
            case 1: return <this.SignUpCardComponent />
            default: return <h4>Please <Link to="/login" >Login</Link></h4>
        }
    }

    render() {
        /* let redirect = null;
        if (this.state.isSignedIn) {
            redirect = <Redirect to={{ pathname: '/', state: this.state }} />;
        } //{redirect} */
        return (
            <div className="jumbotron container divHome">

                <div className="divFlexLogin">
                    {this.switchComponent(this.state.actionStep)}
                </div>
            </div>
        );
    }
}

export default withRouter(Login);