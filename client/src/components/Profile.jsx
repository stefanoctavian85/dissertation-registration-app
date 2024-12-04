import React, { useState, useEffect } from 'react';

function Profile() {
    const [username, setUsername] = useState("");
    const [phoneNumber, setPhoneNumber] = useState();
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("No token found!");
            return;
        }

        fetch(`http://localhost:5000/profile`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                setUsername(data.username);
                setPhoneNumber(data.phoneNumber);
            })
            .catch(err => setError(err));
    }, [username, phoneNumber]);

    if (error) {
        return(
            <div>
                <p>An error occured.</p>
                <p>{error.message}</p>
            </div>
        );
    }

    return(
        <div>
            <p>Username: {username}</p>
            <p>Phone number: {phoneNumber}</p>
        </div>
    );
};

export default Profile;