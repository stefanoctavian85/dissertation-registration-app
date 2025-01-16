import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Profile() {
    const [username, setUsername] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [isStudent, setIsStudent] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState();
    const [btnRequestsText, setBtnRequestsText] = useState("");
    const [error, setError] = useState(null);
    const [token, setToken] = useState("");

    let navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);

        if (!storedToken) {
            setError("You don't have the authorization to be here! Please log in first!");
            return;
        }

        fetch(`http://localhost:5000/profile`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${storedToken}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                setUsername(data.username);
                setPhoneNumber(data.phoneNumber);
                setFirstname(data.firstname);
                setLastname(data.lastname);
                setIsStudent(data.isStudent);
                setBtnRequestsText(data.isStudent ? "Depune o cerere noua" : "Verifica cererile primite");
            })
            .catch(err => setError(err));
    }, [username]);

    if (error) {
        return(
            <div>
                <p>{error}</p>
            </div>
        );
    }

    function requestsHandler() {
        navigate('/request');
    }

    return(
        <div id='profile-main'>
            <p>Bun venit, {firstname +  " " + lastname}!</p>
            <div id='requests'>
                <button onClick={requestsHandler}>{btnRequestsText}</button>
            </div>
        </div>
    );
};

export default Profile;