import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import ProfileBox from "../components/profileBox";
import "../styles/profileCard.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { AlarmInterval } from "../statusEnum";
import { UserGetResponse, UserProfileUpdateBody } from "@shared/types/api/user";

const Profile: React.FC = () => {
  const params = useParams();
  let id: string | undefined | null = params.id;
  if (!id) {
    id = sessionStorage.getItem("userId");
  }
  const isAdmin = sessionStorage.getItem("role") === "0";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [newPass, setNewPassword] = useState("");
  const [checkStrings, setcheckStrings] = useState("");
  const [notification, setNotification] = useState("deactivate");
  const [Alarm, setAlarm] = useState(AlarmInterval.MINUTE_1); 
  const [pencilEdit, setPencilEdit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const response = await fetch(`${(window as any).backendURL}user/profile/${id}`, {
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

  const newPasswordEdit = (e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value);

  const validatePassword = (password: string) => {
    const oneUppercase = /[A-Z]/.test(password);
    const oneLowercase = /[a-z]/.test(password);
    const specialchar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const oneNumber = /[0-9]/.test(password);
    const stringLength = password.length >= 8 && password.length <= 16;

    if (!stringLength || !oneUppercase || !oneLowercase || !specialchar || !oneNumber) {
      setcheckStrings("Password must contain at least one uppercase letter, one lowercase letter, one special character, one number,\n" + " and be between 8-16 characters long.");
      return false;
    }
    setcheckStrings(""); 
    return true;
  };

  const submitButtonClick = async () => {
    if (!validatePassword(newPass)) {
      return; 
    }

    try {
      const updatedPassword = newPass ? newPass : "";

      const updateBody: UserProfileUpdateBody = {};

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

      const response = await fetch(`${(window as any).backendURL}user/profile/${id}`, {
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
        setNewPassword("");

        const data = await fetch(`${(window as any).backendURL}user/profile/${id}`).then(res => res.json());
        setEmail(data.email);
        setPassword(data.password);
        setNotification(data.notifications.method);
        setAlarm(data.notifications.alarm);
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
              onClick={clickEditSect} 
            />
            <input
              type="password"
              className={`input-box-with-icon ${editMode ? '' : 'read-only'}`}
              value={newPass || password}
              onChange={newPasswordEdit}
              placeholder="***********"
            />
          </div>
          {checkStrings && <div className="popup-message">{checkStrings}</div>}
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

