import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import ProfileBox from "../components/profileBox";
import "../styles/profileCard.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { AlarmInterval } from "../statusEnum";
import { UserGetResponse, UserProfileUpdateBody } from "@shared/types/api/user";

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const [email, setEmail] = useState("");
  const [editPassw, setPasswordEdit] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newPass, setNewPassword] = useState("");
  const [notification, setNotification] = useState("deactivate");
  const [Alarm, setAlarm] = useState(AlarmInterval.MINUTE_1); 
  const [pencilEdit, setPencilEdit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const response = await fetch(`http://localhost:3007/user/profile/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data: UserGetResponse = await response.json();
        const { email, notifications } = data;

        // setup state
        setEmail(email);
        setNotification(notifications.email ? "email" : notifications.sms ? "sms" : "deactivate");
        setAlarm(notifications.alarm || AlarmInterval.MINUTE_30);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [id]);

  const tn = (...fns: (() => void)[]) => fns.forEach(fn => fn());

  const clickEditSect = () => tn(
    () => setEditMode(true),
    () => setPencilEdit(false)
  );

  const clickIcon = () => editMode ? (setPasswordEdit(true), setPencilEdit(true)) : null;

  const newPasswordEdit = (e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value);

  const submitButtonClick = async () => {
    try {
      const updatedPassword = newPass;

      const updateBody: UserProfileUpdateBody = {}

      // this can be commented out since they must exist
      if (!updatedPassword && !notification) {
        window.alert("No changes to save");
        return;
      }

      if (updatedPassword) {
        updateBody.password = updatedPassword;
      }

      if (notification) {
        updateBody.notifications = {
          email: notification === "email",
          sms: notification === "sms",
          alarm: Alarm
        };
      }

      const response = await fetch(`http://localhost:3007/user/profile/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${sessionStorage.getItem("token")}` 
        },
        body: JSON.stringify(updateBody),
      });

      if (response.ok) {
        console.log('Changes are saved');
        setEditMode(false);
        setPasswordEdit(false);
        // no need to fetch again if success

        // why navigate back? stay on the same page
        // navigate(-1)
      } else {
        throw new Error('Failed to save info');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <>
      <h1 style={{ marginBottom: "2px" }}>Profile & Settings</h1>
      <div className="box-content">
        <ProfileBox />
        <div className="non-editable-inputs">
          <p className="sub-label">Contact Email</p>
          <input type="text" className="input-box read-only" value={email} readOnly />
          <p className="sub-label">Password</p>
          <div className="box-input">
            <FontAwesomeIcon 
              icon={faPen} 
              className={`icon ${editMode && pencilEdit && 'editable'}`} 
              onClick={clickIcon} 
            />
            <input
              type="password"
              className="input-box-with-icon read-only"
              value={"***********"}
              placeholder="***********"
              readOnly />
            {editPassw && (
              <input
                type="password"
                className="input-box-with-icon newpassedit"
                placeholder="Enter"
                value={newPass}
                onChange={newPasswordEdit} />
            )}
          </div>
          <p className="sub-label">Notification Method</p>
          <select
            className={['input-box', editMode ? 'editable' : 'non-editable'].join(' ')}
            disabled={!editMode}
            value={notification}
            onChange={(e) => setNotification(e.target.value)}
          >
            <option value="deactivate">Deactivate</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
          </select>
          <p className="sub-label">Notification Timing</p>
          <select
            className={['input-box', editMode ? 'editable' : 'non-editable'].join(' ')}
            disabled={!editMode}
            value={Alarm}
            onChange={(e) => setAlarm(Number(e.target.value))}
          >
           {
            Object.keys(AlarmInterval)
            .filter(key => !isNaN(Number(key)))
            .map((interval) => (
              <option key={interval} value={Number(interval)}>
                {interval + " minutes before event"}
              </option>
            ))
           }
          </select>
          <div className="buttons">
            <button className="edit-button" onClick={clickEditSect}>Edit</button>
            <button className="submit-button" onClick={submitButtonClick}>Submit</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;