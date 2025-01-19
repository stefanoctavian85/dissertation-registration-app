import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

function Profile() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [isStudent, setIsStudent] = useState(0);
  const [btnRequestsText, setBtnRequestsText] = useState("");
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");
  const [acceptedApplication, setAcceptedApplication] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  let navigate = useNavigate();

  const submitFile = (e) => {
    setFile(e.target.files[0]);
  } 

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
            data.isStudent ? "Send a new application" : "View received applications"
          );
        })
        .catch((err) =>
          setError(err)
        );
  
        fetch("http://localhost:8080/accepted-application", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${storedToken}`,
          }
        })
          .then(res => {
            if (!res.ok) {
              setError(res.error);
              return;
            }
            return res.json();
          })
          .then(data => {setAcceptedApplication(data.request);
          })
          .catch(err =>
            setError(err)
          );
    }

  }, []);

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
        "Authorization": `Bearer ${storedToken}`,
      }
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
      })
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
    <div id="profile-main">
    <p>{error}</p>
      <p>Bun venit, {firstname + " " + lastname}!</p>
      <div id="requests">
        {acceptedApplication ? (
          <div>
            {(acceptedApplication.status === "rejected" && acceptedApplication.fileUrl !== "") ? (
              <div>
                <p>Your application was rejected by {acceptedApplication.teacher.firstname} {acceptedApplication.teacher.lastname}</p>
                <p>Upload a new file!</p>
                <form onSubmit={(e) => sendApplication(e, acceptedApplication)}>
                      <input type="file" accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.txt"
                      onChange={submitFile}></input>
                      <button type="submit">Send final application</button>
                      <p>{message}</p>
                </form>
              </div>
            ) : (
              <div>
                <p>Your application was accepted by {acceptedApplication.teacher.firstname} {acceptedApplication.teacher.lastname}</p>
                <button onClick={downloadApplication}>View application</button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={requestsHandler}>{btnRequestsText}</button>
        )}
      </div>
    </div>
  );
}

export default Profile;
