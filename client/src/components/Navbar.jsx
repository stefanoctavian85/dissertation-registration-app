import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    let navigate = useNavigate();

    function accountHandler() {
        const loggedInStatus = sessionStorage.getItem("loginStatus");
        if (loggedInStatus === "true") {
            navigate('/profile')
        } else {
            navigate('/login');
        }
    }

    function disconnect() {
        sessionStorage.setItem("loginStatus", "false");
        navigate('/');
        window.location.reload();
    }

    return(
        <div>
            <nav id='nav-bar'>
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    <li><button
                    id='account-button'
                    onClick={accountHandler}>Your account</button></li>
                    <li><button
                    id='disconnect-button'
                    onClick={disconnect}>Disconnect</button></li>
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;