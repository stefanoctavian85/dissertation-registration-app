import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

function Request() {
    const [token, setToken] = useState("");
    const [error, setError] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [message, setMessage] = useState("");
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);

        if (!storedToken) {
            setError("You don't have the authorization to be here! Please log in first!");
            return;
        }

        fetch("http://localhost:5000/teachers", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${storedToken}`,
            },
        }).then(res => {
            if (!res.ok) {
                return res.json().then(data => {
                    setErrorMessage(data.message);
                    return;
                })
            } else {
                return res.json();
            }
        }).then(data => {
            setTeachers(data);
        })
            .catch(err => setError("You don't have the authorization to be here! Please log in first!"));
    }, [token]);

    if (error) {
        return (
            <div>
                <p>{error}</p>
            </div>
        );
    }

    async function submitRequest(teacherId) {
        const storedToken = localStorage.getItem("token");
        const studentId = jwtDecode(token).id;

        try {
            const res = await fetch(`http://localhost:5000/submit-request/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${storedToken}`,
                },
                body: JSON.stringify({
                    teacherId,
                    studentId,
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(`Request successfully sent to ${data.teacherName}`);
            } else {
                setMessage(`Error: ${data.message}`);
            }

        } catch (err) {
            setErrorMessage(err);
        }
    }

    return (
        <div id='request-main'>
            <p>Depune o cerere noua!</p>
            {teachers.length === 0 ? (
                <p>{errorMessage}</p>
            ) : (
                <ul>
                    {teachers.map((teacher, index) => {
                        return <li key={index}>{teacher.firstname + " " + teacher.lastname}<button id={`btn-${index}`} onClick={() => submitRequest(teacher._id)}>Trimite cerere</button></li>
                    })}
                </ul>
            )}
            <p>{error}</p>
        </div>
    );
}

export default Request;