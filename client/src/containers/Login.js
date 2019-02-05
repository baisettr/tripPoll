import React, { Component } from 'react';
import axios from 'axios';

const styles = {
    divHome: {
        backgroundColor: "rgba(255, 255, 255)",
        textAlign: 'center',
        marginTop: '15px'
    }
}

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { isSignedIn: false, userId: "", userPassword: "", error: '', userDetails: {}, actionStep: 0 };
    }

    userAuthentication = (e) => {
        e.preventDefault();
        const userId = this.state.userId;
        const userPassword = this.state.userPassword;
        const userCredentials = { userId, userPassword };
        const url = '/userLogin';
        axios.post(url, { data: userCredentials }
        ).then((res) => {
            const userLogin = res.data;
            if (userLogin.status) {

                this.setState({ activeStep: 1, userDetails: {} });

            } else {
                this.setState({ error: 'Invalid Credentianls. Please check and try again!' })
            }
        }).catch((error) => {
            console.log(error);
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
                <form onSubmit={this.userAuthentication} >
                    <label className="inputLabel">Username</label>
                    <input className="inputLogin" onChange={(e) => { this.setState({ userId: e.target.value, error: "" }) }} placeholder="enter username" required={true} />
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
                <form onSubmit={this.userAuthentication} >
                    <label className="inputLabel">Username</label>
                    <input className="inputLogin" onChange={(e) => { this.setState({ userId: e.target.value, error: "" }) }} placeholder="enter username" required={true} />
                    <br />
                    <label className="inputLabel">Email Id</label>
                    <input className="inputLogin" onChange={(e) => { this.setState({ userId: e.target.value, error: "" }) }} placeholder="enter email" required={true} />
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
        return (
            <div className="jumbotron container" style={styles.divHome} style={{ position: "relative" }}>
                <div>
                    {this.switchComponent(this.state.actionStep)}
                </div>
                <br />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, paddingBottom: '10px' }}>
                    <h6>Proceed to <a href="/">Home</a></h6>
                </div>
            </div>
        );
    }
}

export default Login;