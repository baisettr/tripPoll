import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

class Logout extends Component {
    constructor(props) {
        super(props);
        this.userSignOut();
    }
    userSignOut = async () => {
        localStorage.removeItem('userExpiration');
        localStorage.removeItem('userToken');
        this.props.logoutChange(false);
    };
    render() {
        return (<Redirect from="/logout" to="/" />)
    }
}

export default withRouter(Logout);