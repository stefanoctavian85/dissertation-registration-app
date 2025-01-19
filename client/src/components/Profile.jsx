import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [isStudent, setIsStudent] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState();
  const [btnRequestsText, setBtnRequestsText] = useState("");
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");
  const [acceptedApplication, setAcceptedApplication] = useState("");

  let navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (!storedToken) {
      setError(
        "You don't have the authorization to be here! Please log in first!"
      );
      return;
    }

    fetch(`http://localhost:8080/profile`, {
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
        setUsername(data.username);
        setPhoneNumber(data.phoneNumber);
        setFirstname(data.firstname);
        setLastname(data.lastname);
        setIsStudent(data.isStudent);
        setBtnRequestsText(
          data.isStudent ? "Depune o cerere noua" : "Verifica cererile primite"
        );
      })
      .catch((err) =>
        setError(
          "You don't have the authorization to be here! Please log in first!"
        )
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

  async function downloadApplication(index) {
    const storedToken = localStorage.getItem("token");
    setToken(token);

    if (!storedToken) {
      setError(
        "You don't have the authorization to be here! Please log in first!"
      );
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

  return (
    <div id="profile-main">
      <p>Bun venit, {firstname + " " + lastname}!</p>
      <div id="requests">
        {acceptedApplication ? (
          <div>
            <p>Your application was accepted by {acceptedApplication.teacher.firstname} {acceptedApplication.teacher.lastname}</p>
            <button onClick={() => downloadApplication(acceptedApplication._id)}>View application</button>
          </div>
        ) : (
          <button onClick={requestsHandler}>{btnRequestsText}</button>
        )}
      </div>
    </div>
  );
}

export default Profile;
