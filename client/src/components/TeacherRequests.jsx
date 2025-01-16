import React, { useState, useEffect } from "react";

function TeacherRequests() {
    const [token, setToken] = useState("");
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);

        if (!storedToken) {
            setError("You don't have the authorization to be here! Please log in first!");
            return;
        }

        fetch("http://localhost:5000/requests", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${storedToken}`,
            },
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(data => {
                        setError(error.message);
                        return;
                    })
                }
                return res.json();
            })
            .then(data => {
                setRequests(data.requests);
            })
            .catch(err => setError(err.message));
    }, [token]);

    return(
        <div id="teacher-requests-main">
            <p>Check your new requests!</p>
            {requests.length === 0 ? (
                <p>{error}</p>
            ) : (
                <ul>
                    {requests.map((requests, index) => {
                        <li key={index}></li>
                    })}
                </ul>
            )}
        </div>
    ); 
}

export default TeacherRequests;