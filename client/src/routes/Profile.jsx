import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Profile.css";

function Profile() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [isStudent, setIsStudent] = useState(false);
  const [btnRequestsText, setBtnRequestsText] = useState("");
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");
  const [acceptedApplication, setAcceptedApplication] = useState("");
  const [acceptedApplications, setAcceptedApplications] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  let navigate = useNavigate();

  const submitFile = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (!storedToken) {
      navigate("/login");
      return;
    }

    const decodedToken = jwtDecode(storedToken);
    if (decodedToken.exp < Date.now() / 1000) {
      navigate("/login");
    } else {
      fetch(`http://localhost:8080/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            return;
          }
          return res.json();
        })
        .then((data) => {
          setFirstname(data.firstname);
          setLastname(data.lastname);
          setIsStudent(data.isStudent);
          setBtnRequestsText(
            data.isStudent
              ? "Send a new application"
              : "View received applications"
          );
        })
        .catch((err) => setError(err));

      if (isStudent) {
        fetch("http://localhost:8080/accepted-application", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
          .then((res) => {
            if (!res.ok) {
              setError(res.error);
              return;
            }
            return res.json();
          })
          .then((data) => {
            setAcceptedApplication(data.request);
          })
          .catch((err) => setError(err));
      } else {
        fetch("http://localhost:8080/accepted-applications", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
          .then((res) => {
            if (!res.ok) {
              setError(res.error);
              return;
            }
            return res.json();
          })
          .then((data) => {
            console.log(data.request);
            setAcceptedApplications(data.request);
          })
          .catch((err) => setError(err));
      }
    }
  }, [isStudent]);

  if (error) {
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  }

  function requestsHandler() {
    if (isStudent) {
      navigate("/request");
    } else {
      navigate("/teacher-requests");
    }
  }

  async function downloadApplication() {
    const storedToken = localStorage.getItem("token");
    setToken(token);

    if (!storedToken) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:8080/${acceptedApplication.fileUrl}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = acceptedApplication.fileUrl.split("/").pop();
        link.click();
      })
      .catch((err) => {
        setError(err);
      });
  }

  const sendApplication = async (e, request) => {
    e.preventDefault();

    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      navigate("/login");
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

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Welcome, {firstname + " " + lastname}!</h1>
        <button className="profile-button" onClick={requestsHandler}>
          {isStudent === true
            ? "View Your Applications"
            : "Manage Received Applications"}
        </button>
      </div>
      <div className="profile-content">
        {acceptedApplication ? (
          <div className="application-card">
            {acceptedApplication.status === "accepted" ? (
              <>
                <h2>Application Accepted</h2>
                <p className="text">
                  Coordinator:{" "}
                  {acceptedApplication.teacher.firstname +
                    " " +
                    acceptedApplication.teacher.lastname}
                </p>
                <button
                  className="profile-button profile-download-button"
                  onClick={downloadApplication}
                >
                  View Application
                </button>
              </>
            ) : null}
          </div>
        ) : isStudent === true ? (
          <div className="no-application-card">
            <h2>No Accepted Applications Yet</h2>
            <p className="text">Start by submitting a new request to a coordinator.</p>
            <button className="profile-button" onClick={requestsHandler}>
              Submit a Request
            </button>
          </div>
        ) : (
          <div className="no-application-card">
            <h2>Applications Accepted</h2>
            {acceptedApplications.length > 0 ? (
              <ul className="accepted-students">
                {acceptedApplications.map((application, index) => (
                  <li key={index}>
                    <p className="text">
                      Student:{" "}
                      {application.student.firstname +
                        " " +
                        application.student.lastname}
                    </p>
                    <button
                      className="profile-button profile-download-button"
                      onClick={downloadApplication}
                    >
                      View Application
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Profile;
