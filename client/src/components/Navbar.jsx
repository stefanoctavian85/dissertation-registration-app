import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    let navigate = useNavigate();

    function accountHandler() {
        const loggedInStatus = localStorage.getItem("loginStatus");
        if (loggedInStatus === "true") {
            navigate('/profile')
        } else {
            navigate('/login');
        }
    }

    function logout() {
        localStorage.setItem("loginStatus", "false");
        localStorage.setItem("token", "");
        localStorage.setItem("username", "");
        navigate('/');
        window.location.reload();
    }

    return(
        <div>
            <nav id='nav-bar'>
                <ul>
                    <li><Link to='/' id='home-button'>Home</Link></li>
                    <li><button
                    id='account-button'
                    onClick={accountHandler}>Your account</button></li>
                    <li><button
                    id='logout-button'
                    onClick={logout}>Logout</button></li>
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;