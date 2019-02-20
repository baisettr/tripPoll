import React, { Component } from 'react';
import axios from 'axios';
import { withRouter, Link } from 'react-router-dom';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { isSignedIn: false, userName: "", userEmail: "", userId: "", userPassword: "", error: '', userDetails: {}, actionStep: 0 };
    }

    userSignIn = (e) => {
        e.preventDefault();
        this.setState({ actionStep: 2 });
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
            const message = error.response.data.message;
            this.setState({ error: message, actionStep: 0 });
        });
    }

    userSignUp = (e) => {
        e.preventDefault();
        this.setState({ actionStep: 2 });
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
            const message = error.response.data.message;
            this.setState({ error: message, actionStep: 1 });
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
                    <input className="inputLogin" defaultValue={this.state.userEmail} onChange={(e) => { this.setState({ userEmail: e.target.value, error: "" }) }} placeholder="enter username" required={true} />
                    <br />
                    <label className="inputLabel">Password</label>
                    <input className="inputLogin" type="password" defaultValue={this.state.userPassword} onChange={(e) => { this.setState({ userPassword: e.target.value, error: "" }) }} placeholder="enter password" required={true} />
                    <br />
                    <button className="btn btn-dark">Sign In</button>
                </form>
            </div>
            <br />
            <h6>Please <a href="/#" onClick={this.SignUpShowHandler.bind(this)}>SignUp</a> if you don't have an account!</h6>
        </div>

    LoginCardComponent = () =>
        <div className="cardLogin">
            <div className="card-title h4">Sign in Trip Poll!</div>
            <div className="card-body">
                <h6 style={{ color: 'red' }}>{this.state.error}</h6>
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
                <br />
                <h6>Please <a href="/#" onClick={this.SignUpShowHandler.bind(this)}>Sign up</a> if you don't have an account</h6>
            </div>
        </div>


    SignUpComponent = () =>
        <div>
            <h4>Sign up Trip Poll!</h4>
            <br />
            <h6 style={{ color: 'red' }}>{this.state.error}</h6>
            <div >
                <form onSubmit={this.userSignUp} >
                    <label className="inputLabel">Full Name</label>
                    <input className="inputLogin" defaultValue={this.state.userName} onChange={(e) => { this.setState({ userName: e.target.value, error: "" }) }} placeholder="enter username" required={true} />
                    <br />
                    <label className="inputLabel">Email Id</label>
                    <input className="inputLogin" defaultValue={this.state.userEmail} onChange={(e) => { this.setState({ userEmail: e.target.value, error: "" }) }} placeholder="enter email" required={true} />
                    <br />
                    <label className="inputLabel">Password</label>
                    <input className="inputLogin" type="password" defaultValue={this.state.userPassword} onChange={(e) => { this.setState({ userPassword: e.target.value, error: "" }) }} placeholder="enter password" required={true} />
                    <br />
                    <button className="btn btn-dark">Sign Up</button>
                </form>
            </div>
            <br />
            <h6>Please <a href="/#" onClick={this.SignInShowHandler.bind(this)}>SignIn</a> if you already have an account!</h6>
        </div>


    SignUpCardComponent = () =>
        <div className="cardLogin">
            <div className="card-title h4">Sign up Trip Poll!</div>
            <div className="card-body">
                <h6 style={{ color: 'red' }}>{this.state.error}</h6>
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
                <br />
                <h6>Please <a href="/#" onClick={this.SignInShowHandler.bind(this)}>Sign in</a> if you already have an account!</h6>
            </div>
        </div>

    SpinComponent = () => <div className='Loader'>Loading...</div>

    switchComponent = (e) => {
        switch (e) {
            case 0: return <this.LoginCardComponent />
            case 1: return <this.SignUpCardComponent />
            case 2: return <this.SpinComponent />
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
                <br /><br />
                <h6>Proceed to <Link to="/">Home</Link></h6>
            </div>
        );
    }
}

export default withRouter(Login);