import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    let navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loggedInStatus = sessionStorage.getItem('isLoggedIn');
        if (loggedInStatus) {
            setIsLoggedIn(true);
        }
    })

    function accountHandler() {
        if (isLoggedIn) {
            navigate('/profile')
        } else {
            navigate('/login');
        }
    }

    return(
        <div>
            <nav id='nav-bar'>
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    <li><button
                    id='account-button'
                    onClick={accountHandler}>Your account</button></li>
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;