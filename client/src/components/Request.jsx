import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function Request() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [sentRequests, setSentRequest] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (!storedToken) {
      setError(
        "You don't have the authorization to be here! Please log in first!"
      );
      return;
    }

    fetch("http://localhost:8080/teachers", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${storedToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            setMessage(data.message);
            return;
          });
        } else {
          return res.json();
        }
      })
      .then((data) => {
        setTeachers(data);
      })
      .catch((err) =>
        setError(
          "You don't have the authorization to be here! Please log in first!"
        )
      );

      fetch("http://localhost:8080/sent-requests", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${storedToken}`,
        }
      })
        .then((res) => {
          if (!res.ok) {
            setError(error.message);
            return;
          } else {
            return res.json();
          }
        })
        .then((data) => {
          setSentRequest(data.sentRequests);
        })
  }, []);

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


    const res = await fetch(`http://localhost:8080/submit-request/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
      body: JSON.stringify({
        teacherId,
        studentId,
      }),
    });

    const data = await res.json();

    setMessage(data.message);
  }

  return (
    <div id="request-main">
      <p>Depune o cerere noua!</p>
      {teachers.length === 0 ? (
        <p>{message}</p>
      ) : (
        <div>
          <ul>
            {teachers.map((teacher, index) => {
              return (
                <li key={index}>
                  {teacher.firstname + " " + teacher.lastname}
                  <button
                    id={`btn-${index}`}
                    onClick={() => submitRequest(teacher._id)}
                  >
                    Trimite cerere
                  </button>
                </li>
              );
            })
            }
        </ul>
        <p>{message}</p>
        </div>
      )}
      <div>
        {sentRequests.length !== 0 ? (
          <div>
            <ul>
              {sentRequests.map((request, index) => {
                return (
                  <li key={index}>
                    {request.teacher.firstname} {request.teacher.lastname} - {request.status}
                  </li>
                )
              })}
            </ul>
          </div>
        ) : (<p>You didn't send any request yet!</p>)}
      </div>
      <p>{error}</p>
    </div>
  );
}

export default Request;
