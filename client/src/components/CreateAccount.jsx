import React, {useState} from 'react';

function CreateAccount() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    function submitUsername(e) {
        setUsername(e.target.value);
    }

    function submitPassword(e) {
        setPassword(e.target.value);
    }

    function submitButton() {
        
    }

    return(
        <div>
            <h1>Create Account</h1>
            <input
                type='text'
                placeholder='Enter a username...'
                id='usernameInput'
                value={submitUsername}
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
                    Create account
            </button>
        </div>
    );
}

export default CreateAccount;