import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function Request() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [sentRequests, setSentRequest] = useState([]);
  const [file, setFile] = useState(null);

  const submitFile = (e) => {
    setFile(e.target.files[0]);
  }

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

    if (!storedToken) {
      setError(
        "You don't have the authorization to be here! Please log in first!"
      );
      return;
    }

    const studentId = jwtDecode(token).id;

    try {
      const res = await fetch(`http://localhost:8080/submit-request`, {
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

      if (!res.ok) {
        setMessage(data.message);
        return;
      }

      setMessage(data.message);
    } catch (err) {
      setMessage(err);
    }
  }

  const sendApplication = async (e, request) => {
    e.preventDefault();

    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      setError(
        "You don't have the authorization to be here! Please log in first!"
      );
      return;
    }

    if (!file) {
      setMessage("Please upload a file!");
      return;
    } else {
      setMessage("");
    }

    let studentId = jwtDecode(token).id;
    let teacherId = request.teacher._id;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("student", studentId);
    formData.append("teacher", teacherId);

    const res = await fetch("http://localhost:8080/send-final-application", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${storedToken}`
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error);
    }
  }

  return (
    <div id="request-main">
      <p>Submit a new application!</p>
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
                    Send application
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
              {sentRequests.map((request, index) => (
                request.status === "approved" ? (
                  <div key={index}>
                    <li key={index}>
                      {request.teacher.firstname} {request.teacher.lastname} - {request.status}
                    </li>
                    <p>Upload here your request!</p>
                    <form onSubmit={(e) => sendApplication(e, request)}>
                      <input type="file" accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.txt"
                        onChange={submitFile}></input>
                      <button type="submit">Send final application</button>
                      <p>{message}</p>
                    </form>
                  </div>
                ) : (
                  <li key={index}>
                    {request.teacher.firstname} {request.teacher.lastname} - {request.status} - {request.message}
                  </li>
                )
              ))}
            </ul>
          </div>
        ) : (<p>You didn't send any request yet!</p>)}
      </div>
      <div>
        <p>Download the application form</p>
        <a href="http://localhost:8080/download">Download</a>
      </div>
      <p>{error}</p>
    </div>
  );
}

export default Request;
