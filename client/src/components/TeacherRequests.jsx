import React, { useState, useEffect } from "react";

function TeacherRequests() {
    const [token, setToken] = useState("");
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState("");
    const [rejectionMessage, setRejectionMessage] = useState("");

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
                    return res.json().then(error => {
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
    });

    function submitRejectionMessage(e) {
        setRejectionMessage(e.target.value);
    }

    async function handleRequest(id, status) {
        const requestResponse = {
            requestId: id,
            status,
            message: rejectionMessage,
        }

        const response = await fetch("http://localhost:5000/change-request-status", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(requestResponse),
        });
    }

    return (
        <div id="teacher-requests-main">
            <p>Check your new requests!</p>
            {requests.length === 0 ? (
                <p>{error}</p>
            ) : (
                <ul>
                    {requests.map((request, index) => request.status === "pending" && (
                        <li key={index}>{request.student.firstname} {request.student.lastname}
                            <button onClick={() => handleRequest(request._id, "approved")}>Accept</button>
                            <input type="text" placeholder="Reason for rejection" onChange={(e) => submitRejectionMessage(e)} />
                            <button onClick={() => handleRequest(request._id, "rejected")}>Reject</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// 

export default TeacherRequests;