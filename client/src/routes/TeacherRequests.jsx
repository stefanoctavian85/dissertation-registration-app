import React, { useState, useEffect, useRef } from "react";
import "./TeacherRequest.css";
import Loading from "../components/Loading";

function TeacherRequests() {
  const fileInput = useRef(null);
  const [token, setToken] = useState("");
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [acceptedRequestsNumber, setAcceptedRequestsNumber] = useState(0);
  const [needsUpdate, setNeedsUpdate] = useState(true);
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [finalApplications, setFinalApplications] = useState([]);
  const [file, setFile] = useState("");
  const [message, setMessage] = useState("");

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

    if (needsUpdate) {
      fetch("http://localhost:8080/requests", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            setError(res.message);
            return;
          }
          return res.json();
        })
        .then((data) => {
          setRequests(data.requests);
          setNeedsUpdate(false);
        })
        .catch((err) => setError("You don't have new requests!"));

      fetch("http://localhost:8080/accepted-requests-count", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            setError(res.message);
            return;
          } else {
            return res.json();
          }
        })
        .then((data) => {
          setAcceptedRequestsNumber(data.acceptedRequests);
          setNeedsUpdate(false);
        })
        .catch((err) => {
          setError(err);
        });

      fetch("http://localhost:8080/final-applications", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            setError(res.message);
            return;
          }
          return res.json();
        })
        .then((data) => {
          setFinalApplications(data.filteredRequests);
          setNeedsUpdate(false);
        })
        .catch((err) => {
          setError(err);
        });
    }
  }, [needsUpdate]);

  function submitRejectionMessage(e) {
    setRejectionMessage(e.target.value);
  }

  function handlePickClick() {
    fileInput.current.click();
  }

  async function handleRequest(id, status) {
    const requestResponse = {
      requestId: id,
      status,
      message: rejectionMessage,
    };

    const res = await fetch("http://localhost:8080/change-request-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestResponse),
    });

    if (res.ok) {
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== id)
      );
      setNeedsUpdate(true);
    }
  }

  async function downloadApplication(index) {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (!storedToken) {
      setError(
        "You don't have the authorization to be here! Please log in first!"
      );
      return;
    }

    fetch(`http://localhost:8080/${finalApplications[index].fileUrl}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          setMessage("Application not found!");
          return;
        }
        return res.blob();
      })
      .then((blob) => {
        if (blob) {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = finalApplications[index].fileUrl.split("/").pop();
          link.click();
        }
      })
      .catch((err) => {
        setError(err);
      });
  }

  const handleFinalApplication = async (e, reqId, studentId, file) => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (!storedToken) {
      setError(
        "You don't have the authorization to be here! Please log in first!"
      );
      return;
    }

    if (!file && e.target.value === "accepted") {
      setMessage("Please upload a file!");
      return;
    } else {
      setMessage("");
    }

    setNeedsUpdate(true);
    console.log(file);

    if (e.target.value === "accepted") {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("id", reqId);
      formData.append("student", studentId);
      formData.append("status", "accepted");

      const res = await fetch(
        "http://localhost:8080/accept-final-application",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
          body: formData,
        }
      );
      if (res.ok) {
        setFinalApplications((prevReq) =>
          prevReq.filter((req) => req._id !== reqId)
        );
        setNeedsUpdate(true);
      }
    } else if (e.target.value === "rejected") {
      const res = fetch("http://localhost:8080/reject-final-application", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "rejected",
          id: reqId,
          student: studentId,
        }),
      });
      if (res.ok) {
        setFinalApplications((prevReq) =>
          prevReq.filter((req) => req._id !== reqId)
        );
        setNeedsUpdate(true);
      }
    }
  };

  return (
    <div className="teacher-requests-page">
      <div className="header">
        <h1>Dissertation Management</h1>
        <p>Number of accepted applications: {acceptedRequestsNumber}/5</p>
      </div>
      <div className="main">
        <div className="fragment preliminary-requests">
          <h2>Preliminary Requests</h2>
          {requests.filter((req) => req.status === "pending").length > 0 ? (
            requests
              .filter((req) => req.status === "pending")
              .map((request, index) => (
                <div key={index} className="request-card">
                  <p>
                    {request.student.firstname} {request.student.lastname}
                  </p>
                  <div className="cta">
                    <button
                      className="accept-button"
                      onClick={() => handleRequest(request._id, "approved")}
                    >
                      Accept
                    </button>
                    <input
                      type="text"
                      className="rejection-message"
                      placeholder="Reason for rejection"
                      onChange={(e) => setRejectionMessage(e.target.value)}
                    />
                    <button
                      className="reject-button"
                      onClick={() => handleRequest(request._id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <p>No new requests available!</p>
          )}
        </div>
        <div className="fragment final-applications">
          <h2>Final Applications</h2>
          {finalApplications.length > 0 ? (
            finalApplications.map((request, index) => (
              <div key={index} className="application-card-teacher">
                <p>
                  {request.student.firstname} {request.student.lastname}
                </p>
                <div className="cta">
                  <button
                    className="view-button"
                    onClick={() => downloadApplication(index)}
                  >
                    View Application
                  </button>
                  <div className="file-btn-wrapper">
                    <button className="btn-upload" onClick={handlePickClick}>
                      Choose File
                    </button>
                    <span className="file-name">
                      {file ? file.name : "No file selected"}
                    </span>
                    <input
                      type="file"
                      onChange={submitFile}
                      className="file-input"
                      accept=".pdf,.doc,.docx"
                      ref={fileInput}
                    />
                  </div>
                  <button
                    className="accept-button"
                    onClick={(e) =>
                      handleFinalApplication(
                        e,
                        request._id,
                        request.student._id,
                        file
                      )
                    }
                    value="accepted"
                  >
                    Accept
                  </button>
                  <button
                    className="reject-button"
                    onClick={(e) =>
                      handleFinalApplication(
                        e,
                        request._id,
                        request.student._id
                      )
                    }
                    value="rejected"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No final applications submitted yet!</p>
          )}
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
      {message && (
        <p onClick={() => setMessage("")} className="message">
          {message}
        </p>
      )}
    </div>
  );
}

export default TeacherRequests;
