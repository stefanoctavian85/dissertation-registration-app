import React, { useState, useEffect } from "react";

function TeacherRequests() {
  const [token, setToken] = useState("");
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [requestApprovedNr, setRequestApprovedNr] = useState(0);
  const [needsUpdate, setNeedsUpdate] = useState(true);
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [finalApplications, setFinalApplications] = useState([]);

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
            return res.json().then((error) => {
              setError(error.message);
              return;
            });
          }
          return res.json();
        })
        .then((data) => {
          setRequests(data.requests);
          setNeedsUpdate(false);
        })
        .catch((err) => setError(err.message));
  
      fetch("http://localhost:8080/approved-requests-count", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${storedToken}`,
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
          setRequestApprovedNr(data.approvedRequests);
        })
        .catch((err) => {
          setError(err);
        }) 
    }

    fetch("http://localhost:8080/final-applications", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${storedToken}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setFinalApplications(data.filteredRequests);
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestResponse),
      }
    );

    if (res.ok) {
      setNeedsUpdate(true);
    }
  }

  return (
    <div id="teacher-requests-main">
      <p>Check your new requests!</p>
      <p>Number of approved requests: {requestApprovedNr}/5</p>
      {requests.length === 0 ? (
        <p>{error}</p>
      ) : (
        <div>
          {requestApprovedNr < 5 ? (
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
      {finalApplications.length === 0 ? (
        <p>You don't have any final application yet!</p>
      ) : (
        <div>
          <ul>
            {finalApplications.map((request, index) => (
              <li key={index}>{request.student.firstname} {request.student.lastname} - 
                <a href={`http://localhost:8080/${request.fileUrl}`} download={request.fileUrl.split("/").pop()} target="_blank" rel="noopener noreferrer"> View application</a>
                <p>{`http://localhost:8080/${request.fileUrl}`}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p>{error}</p>
    </div>
  );
}

export default TeacherRequests;
