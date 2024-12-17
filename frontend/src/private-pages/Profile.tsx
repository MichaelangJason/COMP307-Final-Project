import React, { useState, useEffect } from "react";
import ProfileBox from "../components/profileBox";
import "../styles/profileCard.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const Profile: React.FC = () => {
  const [email, fixEmail] = useState("");
  const [password, fixpassword] = useState("");
  const [editPassw, setPasswordEdit] = useState(false);
  const [editMode, fixEditMode] = useState(false);
  const [newPass, fixNewPassword] = useState("");
  const [notification, setNotification] = useState("deactivate");
  const [Timing, setTiming] = useState("input-box");
  const [penciledit, fixpencil] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      const emailFromBackend = "example@example.com"; 
      const passwordFromBackend = "randomhg"; 
      fixEmail(emailFromBackend);
      fixpassword(passwordFromBackend);
    };

    fetchData();
  }, []);

  const tn = (...fns: (() => void)[]) => fns.forEach(fn => fn());
  const clickEditSect = () => tn(
  () => fixEditMode(true),
  () => fixpencil(false)
);





const clickIcon = () => editMode ? (setPasswordEdit(true), fixpencil(true)) : null;


  const newPasswordEdit = (e: React.ChangeEvent<HTMLInputElement>) => fixNewPassword(e.target.value);

  
// saving info by reloading the page
  const submitButtonClick = async () => {
    try {
      const response = await fetch('/api/saveProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPass, notification, Timing }),
      });
  
      if (response.ok) {
        console.log('Changes are saved:', await response.json());
        fixEditMode(false);               
        setPasswordEdit(false);       
        fixNewPassword("");               
        
        window.location.reload();
      } else {
        throw new Error('Failed to save info');
      }
    } catch (error) {
      console.error('the error:', error);
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
            className={`icon ${editMode && penciledit && 'editable'}`} 
            onClick={clickIcon} 
          />
            <input
              type="password"
              className="input-box-with-icon read-only"
              value={password}
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
            value={Timing}
            onChange={(e) => setTiming(e.target.value)}
          >
            <option value="input-box">1 minute before event</option>
            <option value="email">5 minutes before event</option>
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






















