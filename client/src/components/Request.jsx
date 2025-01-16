import React, {useState, useEffect} from 'react';

function Request() {
    const [token, setToken] = useState("");
    const [error, setError] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [teachers, setTeachers] = useState([]);
    
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
          .catch(err => setError(err));
    }, [token]);

    if (error) {
        return(
            <div>
                <p>{error}</p>
            </div>
        );
    }

    return(
        <div id='request-main'>
            <p>Depune o cerere noua!</p>
            {teachers.length === 0 ? (
                <p>{errorMessage}</p>
            ) : (
                <ul>
                    {teachers.map((teacher, index) => (
                        <li key={index}>{teacher.firstname + " " + teacher.lastname}<button id={`btn-${index}`}>Trimite cerere</button></li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Request;