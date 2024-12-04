import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    function submitUsername(e) {
        setUsername(e.target.value);
    }

    function submitPassword(e) {
        setPassword(e.target.value);
    }

    async function submitButton() {
        const userCredentials = {
            username: username,
            password: password,
        };

        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userCredentials),
        });

        const data = await response.json();

        setMessage(data.message);
        
        if (data.success) {
            setTimeout(() => {
                localStorage.setItem("loginStatus", "true");
                localStorage.setItem("username", username);
                localStorage.setItem("token", data.token);
                setIsLoggedIn(true);
                navigate('/')
            }, 1000);
        } else {
            localStorage.setItem("loginStatus", "false");
            setIsLoggedIn(false);
        }

        setUsername("");
        setPassword("");
    }

    return(
        <div>
            <h1>Login</h1>
            <input
                type="text"
                id="usernameInput"
                placeholder='Enter username...'
                value={username}
                onChange={(event) => submitUsername(event)}/><br/>
            <input
                type="password"
                id="passwordInput"
                placeholder='Enter password...'
                value={password}
                onChange={(event) => submitPassword(event)}/><br/>
            <button
                id='login-button'
                onClick={submitButton}>
                    Login
            </button>

            <p>{message}</p>
        </div>
    );
}

export default Login;