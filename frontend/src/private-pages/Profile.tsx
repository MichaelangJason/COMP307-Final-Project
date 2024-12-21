import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import profilepic from "../images/profilepic.png";
import { AlarmInterval } from "../statusEnum";
import { UserGetResponse, UserProfileUpdateBody } from "@shared/types/api/user";
import "../styles/Profile.scss";

const Profile: React.FC = () => {
  const params = useParams();
  let userId: string | undefined | null = params.id;
  if (!userId) {
    userId = sessionStorage.getItem("userId");
  }
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userId: "",
    password: "",
    newPassword: "",
    notificationMethod: "deactivate",
    alarmInterval: AlarmInterval.MINUTE_1,
  });

  const [editMode, setEditMode] = useState(false);
  const [passwordEditMode, setPasswordEditMode] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        const response = await fetch(
          `${(window as any).backendURL}user/profile/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data: UserGetResponse = await response.json();
        setUserData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          userId: userId,
          password: "",
          newPassword: "",
          notificationMethod: data.notifications.email
            ? "email"
            : data.notifications.sms
            ? "sms"
            : "deactivate",
          alarmInterval: data.notifications.alarm || AlarmInterval.MINUTE_1,
        });
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSubmit = async () => {
    try {
      const updateBody: UserProfileUpdateBody = {
        notifications: {
          email: userData.notificationMethod === "email",
          sms: userData.notificationMethod === "sms",
          alarm: userData.alarmInterval,
        },
      };

      if (userData.newPassword) {
        updateBody.password = userData.newPassword;
      }

      const response = await fetch(
        `${(window as any).backendURL}user/profile/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify(updateBody),
        }
      );

      if (!response.ok) throw new Error("Failed to update profile");

      alert("Profile updated successfully");
      
      setEditMode(false);
      setPasswordEditMode(false);
      setUserData((prev) => ({ ...prev, newPassword: "" }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <h1>Profile & Settings</h1>

      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-image-container">
              <img src={profilepic} alt="Profile" className="profile-image" />
              <div className="profile-id">ID: {userData.userId}</div>
            </div>
            <div className="basic-info">
              <div className="form-group">
                <label>First name</label>
                <input
                  type="text"
                  value={userData.firstName}
                  readOnly
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label>Last name</label>
                <input
                  type="text"
                  value={userData.lastName}
                  readOnly
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <div className="profile-settings">
            <div className="form-group">
              <label>Contact Email</label>
              <input
                type="email"
                value={userData.email}
                readOnly
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input">
                <input
                  type="password"
                  value={userData.newPassword}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  readOnly={!passwordEditMode}
                  className={`input-field ${
                    passwordEditMode ? "editable" : ""
                  }`}
                  placeholder="***********"
                />
                <FontAwesomeIcon
                  icon={faPen}
                  className={`edit-icon ${passwordEditMode ? "active" : ""}`}
                  onClick={() => setPasswordEditMode(!passwordEditMode)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notification Parameters</label>
              <select
                value={userData.notificationMethod}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    notificationMethod: e.target.value,
                  }))
                }
                disabled={!editMode}
                className={`input-field ${editMode ? "editable" : ""}`}
              >
                <option value="deactivate">Deactivate</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
              </select>
            </div>

            <div className="form-group">
              <select
                value={userData.alarmInterval}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    alarmInterval: Number(e.target.value),
                  }))
                }
                disabled={!editMode}
                className={`input-field ${editMode ? "editable" : ""}`}
              >
                <option value={1}>1 minute before event</option>
                <option value={5}>5 minutes before event</option>
                <option value={10}>10 minutes before event</option>
                <option value={15}>15 minutes before event</option>
                <option value={30}>30 minutes before event</option>
              </select>
            </div>

            <div className="button-container">
              <button onClick={() => setEditMode(true)} className="edit-button">
                Edit
              </button>
              <button
                onClick={handleSubmit}
                className="submit-button"
                disabled={!editMode && !passwordEditMode}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
