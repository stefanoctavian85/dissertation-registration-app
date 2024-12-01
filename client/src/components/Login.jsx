import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLogging, setIsLogging] = useState(false);
    const navigate = useNavigate();

    function submitUsername(e) {
        setUsername(e.target.value);
    }

    function submitPassword(e) {
        setPassword(e.target.value);
    }

    function createAccount() {
        navigate('/create-account');
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

            <button
                id='create-account-button'
                onClick={createAccount}>
                    Create account
            </button>

            <p>{message}</p>
        </div>
    );
}

export default Login;