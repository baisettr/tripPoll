import React from 'react';

const Logout = (props) => {
    userSignOut(props);
    return (<div></div>)
}

const userSignOut = async (props) => {
    localStorage.removeItem('userAuth');
    localStorage.removeItem('userToken');
    props.logoutChange(false);
};

export default Logout;