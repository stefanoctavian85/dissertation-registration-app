import React, { useState, useEffect } from "react";

function TeacherRequests() {
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

    if (needsUpdate) {
      fetch("http://localhost:8080/requests", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${storedToken}`,
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
          "Authorization": `Bearer ${storedToken}`,
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
          "Authorization": `Bearer ${storedToken}`,
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

  async function handleRequest(id, status) {
    const requestResponse = {
      requestId: id,
      status,
      message: rejectionMessage,
    };

    const res = await fetch(
      "http://localhost:8080/change-request-status",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(requestResponse),
      }
    );

    if (res.ok) {
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
        "Authorization": `Bearer ${storedToken}`,
      }
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
      })
  }

  const handleFinalApplication = async (e, reqId, studentId, file) => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (!storedToken) {
      setError("You don't have the authorization to be here! Please log in first!");
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
      setFinalApplications(finalApplications.filter((request) => request._id !== reqId));

      const formData = new FormData();
      formData.append("file", file);
      formData.append("id", reqId);
      formData.append("student", studentId);
      formData.append("status", "accepted");

      const res = await fetch("http://localhost:8080/accept-final-application", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${storedToken}`,
        },
        body: formData,
      });
    } else if (e.target.value === "rejected") {
      setFinalApplications(finalApplications.filter((request) => request._id !== reqId));

      fetch("http://localhost:8080/reject-final-application", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "rejected", id: reqId, student: studentId }),
      });
    }
  }

  return (
    <div id="teacher-requests-main">
      {token ? (
        <div>
          <p>Number of accepted applications: {acceptedRequestsNumber}/5</p>
      {!requests ? (
        <p>{error}</p>
      ) : (
        <div>
          {acceptedRequestsNumber < 5 ? (
            <div>
              <p>Preliminary requests:</p>
              <ul>
                {requests.filter(request => request.status === "pending").length > 0 ? (
                  requests.map(
                    (request, index) =>
                      request.status === "pending" && (
                        <li key={index}>
                          {request.student.firstname} {request.student.lastname}
                          <button
                            onClick={() => handleRequest(request._id, "approved")}
                          >
                            Accept
                          </button>
                          <input
                            type="text"
                            placeholder="Reason for rejection"
                            onChange={(e) => submitRejectionMessage(e)}
                          />
                          <button
                            onClick={() => handleRequest(request._id, "rejected")}
                          >
                            Reject
                          </button>
                        </li>
                      ))
                ) : (<p>You don't have new requests!</p>)}
              </ul>
            </div>
          ) : (
            <p>You have reached the maximum number of requests!</p>
          )}
        </div>
      )}
      <p>Final applications:</p>
      {Array.isArray(finalApplications) && finalApplications.length === 0 ? (
        <p>You don't have any final application yet!</p>
      ) : (
        <div>
          <ul>
            {finalApplications.map((request, index) => (
              <div key={index}>
                <li>{request.student.firstname} {request.student.lastname} -
                  <button onClick={() => downloadApplication(index)}>View application</button>
                  <button onClick={(e) => handleFinalApplication(e, request._id, request.student._id, file)} value="accepted">Accept</button>
                  <p>{request.status}</p>
                  <form>
                    <input type="file" accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.txt"
                      onChange={submitFile}></input>
                  </form>
                  <button onClick={(e) => handleFinalApplication(e, request._id, request.student._id)} value="rejected">Reject</button>
                </li>
                <p>{message}</p>
              </div>
            ))}
          </ul>
        </div>
      )}
        </div>
      ) : (
        <p>{error}</p>
      )}
    </div>
  );
}

export default TeacherRequests;
