import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import "./Request.css";

function Request() {
  const fileInput = useRef(null);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [sentRequests, setSentRequest] = useState([]);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const submitFile = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (!storedToken) {
      setError(
        "You don't have the authorization to be here! Please log in first!"
      );
      return;
    }
    setIsLoading(true);

    fetch("http://localhost:8080/teachers", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${storedToken}`,
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
        Authorization: `Bearer ${storedToken}`,
      },
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
        setIsLoading(false);
      });
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
      const updatedRequest = await fetch(
        "http://localhost:8080/sent-requests",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      ).then((res) => res.json());
      setSentRequest(updatedRequest.sentRequests);
    } catch (err) {
      setMessage(err);
    }
  }

  const handlePickClick = () => {
    fileInput.current.click();
  };

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
        Authorization: `Bearer ${storedToken}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error);
    }
  };

  if (isLoading) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <div className="request-page">
      <div className="teachers-section">
        <h2>Submit a New Application</h2>
        {teachers.length === 0 ? (
          <p>{message}</p>
        ) : (
          <div className="teacher-cards">
            {teachers.map((teacher, index) => (
              <div className="card" key={index}>
                <p>{teacher.firstname + " " + teacher.lastname}</p>
                <button
                  className="button"
                  onClick={() => submitRequest(teacher._id)}
                >
                  Send Application
                </button>
              </div>
            ))}
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
        {message && (
          <div
            onClick={() => {
              setMessage("");
            }}
            className="success-message"
          >
            {message}
          </div>
        )}
        <div className="requests-section">
          <h2>Submitted Requests</h2>
          {sentRequests.length === 0 ? (
            <p>You haven&apos;t sent any requests yet!</p>
          ) : (
            <div className="request-cards">
              {sentRequests.map((request, index) => (
                <div className="card" key={index}>
                  <p>
                    {request.teacher.firstname} {request.teacher.lastname} -{" "}
                    {request.status}
                  </p>
                  {request.status === "approved" && (
                    <>
                      <p>Upload your request here:</p>
                      <form onSubmit={(e) => sendApplication(e, request)}>
                        <input
                          type="file"
                          accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.txt"
                          onChange={submitFile}
                          ref={fileInput}
                          style={{ display: "none" }}
                        ></input>
                        <button
                          id="button"
                          type="button"
                          onClick={handlePickClick}
                        >
                          Pick a file
                        </button>
                        <button className="button" type="submit">
                          Send final application
                        </button>
                      </form>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Request;
