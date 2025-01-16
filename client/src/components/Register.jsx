import React, {useState} from 'react';
import './Register.css';

function Register() {
    const [username, setUsername] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    function submitUsername(e) {
        setUsername(e.target.value);
    }

    function submitFirstname(e) {
        setFirstname(e.target.value);
    }

    function submitLastname(e) {
        setLastname(e.target.value);
    }

    function submitEmail(e) {
        setEmail(e.target.value);
    }

    function submitPassword(e) {
        setPassword(e.target.value);
    }

    async function signinButton() {
        const userCredentials = {
            username,
            firstname,
            lastname,
            email,
            password,
        };

        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userCredentials),
        });

        const data = await response.json();

        setMessage(data.message);
    }

    return(
        <div>
            <h1>Register</h1>
            <div className='register-container'>
                <div className='register-item'>
                <label>Username</label>
                <input
                    type='text'
                    id='usernameInput'
                    placeholder='Enter username...'
                    value={username}
                    onChange={submitUsername}></input>
                </div>
                <div className='register-item'>
                <label>First name</label>
                <input
                    type='text'
                    id='firstnameInput'
                    placeholder='Enter first name...'
                    value={firstname}
                    onChange={submitFirstname}></input>
                </div>
                <div className='register-item'>
                <label>Last name</label>
                <input
                    type='text'
                    id='lastnameInput'
                    placeholder='Enter last name...'
                    value={lastname}
                    onChange={submitLastname}></input>
                </div>
                <div className='register-item'>
                    <label>Email</label>
                    <input
                        type='email'
                        id='emailInput'
                        placeholder='Enter email...'
                        value={email}
                        onChange={submitEmail}></input>
                </div>
                <div className='register-item'>
                    <label>Password</label>
                    <input
                    type='password'
                    id='passwordInput'
                    placeholder='Enter password...'
                    value={password}
                    onChange={submitPassword}></input>
                </div>
                <button
                    id='signin-button'
                    onClick={signinButton}
                >Sign in</button>
            </div>
            <p id='message'>{message}</p>
        </div>
    );
}

export default Register;