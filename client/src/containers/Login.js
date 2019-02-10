import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { isSignedIn: false, userName: "", userEmail: "", userId: "", userPassword: "", error: '', userDetails: {}, actionStep: 0 };
    }

    userSignIn = (e) => {
        e.preventDefault();
        const userEmail = this.state.userEmail;
        const userPassword = this.state.userPassword;
        const userCredentials = { userEmail, userPassword };
        const url = '/userSignIn';
        axios.post(url, { data: userCredentials }
        ).then((res) => {
            const userToken = res.data.token;
            localStorage.setItem('userAuth', true);
            localStorage.setItem('userToken', userToken);
            //this.props.history.push('/', this.state)
            this.setState({ isSignedIn: true });
            this.props.loginChange(true);
        }).catch((error) => {
            const message = error.response.data.message;
            this.setState({ error: message });
        });
    }

    userSignUp = (e) => {
        e.preventDefault();
        const userName = this.state.userName;
        const userEmail = this.state.userEmail;
        const userPassword = this.state.userPassword;
        const userDetails = { userName, userEmail, userPassword };
        const url = '/userSignUp';
        axios.post(url, { data: userDetails }
        ).then((res) => {
            const userToken = res.data.token;
            localStorage.setItem('userAuth', true);
            localStorage.setItem('userToken', userToken);
            this.setState({ isSignedIn: true });
        }).catch((error) => {
            const message = error.response.data.message;
            this.setState({ error: message });
        });
    }

    userDetails = (e) => {
        e.preventDefault();
        const userToken = localStorage.userToken;
        const headers = { Authorization: 'Bearer ' + userToken };
        const url = '/userDetails';
        axios.get(url, { headers }
        ).then((res) => {
            console.log(res.data);
        }).catch((error) => {
            console.log(error.response.data);
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
    LoginComponent = () =>
        <div>
            <h4>Sign in Trip Poll!</h4>
            <br />
            <h6 style={{ color: 'red' }}>{this.state.error}</h6>
            <div >
                <form onSubmit={this.userSignIn} >
                    <label className="inputLabel">Email Id</label>
                    <input className="inputLogin" onChange={(e) => { this.setState({ userEmail: e.target.value, error: "" }) }} placeholder="enter username" required={true} />
                    <br />
                    <label className="inputLabel">Password</label>
                    <input className="inputLogin" type="password" onChange={(e) => { this.setState({ userPassword: e.target.value, error: "" }) }} placeholder="enter password" required={true} />
                    <br />
                    <button className="btn btn-dark">Sign In</button>
                </form>
            </div>
            <br />
            <h6>Please <a href="/#" onClick={this.SignUpShowHandler.bind(this)}>SignUp</a> if you don't have an account!</h6>
        </div>


    SignUpComponent = () =>
        <div>
            <h4>Sign up Trip Poll!</h4>
            <br />
            <h6 style={{ color: 'red' }}>{this.state.error}</h6>
            <div >
                <form onSubmit={this.userSignUp} >
                    <label className="inputLabel">Full Name</label>
                    <input className="inputLogin" onChange={(e) => { this.setState({ userName: e.target.value, error: "" }) }} placeholder="enter username" required={true} />
                    <br />
                    <label className="inputLabel">Email Id</label>
                    <input className="inputLogin" onChange={(e) => { this.setState({ userEmail: e.target.value, error: "" }) }} placeholder="enter email" required={true} />
                    <br />
                    <label className="inputLabel">Password</label>
                    <input className="inputLogin" type="password" onChange={(e) => { this.setState({ userPassword: e.target.value, error: "" }) }} placeholder="enter password" required={true} />
                    <br />
                    <button className="btn btn-dark">Sign Up</button>
                </form>
            </div>
            <br />
            <h6>Please <a href="/#" onClick={this.SignInShowHandler.bind(this)}>SignIn</a> if you already have an account!</h6>
        </div>


    switchComponent = (e) => {
        switch (e) {
            case 0: return <this.LoginComponent />
            case 1: return <this.SignUpComponent />
            default: return <h4>Please <a href="/login" >Login</a></h4>
        }
    }

    render() {
        /* let redirect = null;
        if (this.state.isSignedIn) {
            redirect = <Redirect to={{ pathname: '/', state: this.state }} />;
        } //{redirect} */
        return (
            <div className="jumbotron container divHome">

                <div>
                    {this.switchComponent(this.state.actionStep)}
                </div>
                <br /><br />
                <h6>Proceed to <a href="/">Home</a></h6>
            </div>
        );
    }
}

export default Login;