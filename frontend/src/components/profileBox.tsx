import React, { useState, useEffect } from "react";
import "../styles/profileCard.scss";
import profilepic from "../images/profilepic.png";
import email from "../private-pages/Profile";

const ProfileBox: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
  
    const fetchData = async () => {
      // fetching data for backend
      const fetchfirstName = "John";
      const fetchlastName = "Doe";
      const fetchuserId = "1234567"; 

      setFirstName(fetchfirstName);
      setLastName(fetchlastName);
      setUserId(fetchuserId);
    };

    fetchData();
  }, []);

  return (
    <div className="box">
      <div className="box-container">
        <img
          className="box-image"
          src={profilepic}
          alt="Profile"
        />
        <div className="box-id">
          ID: {userId}
        </div>
      </div>
      <div className="inside">
        <p className="name">First name</p>
        <input type="text" className="card-input read-only" value={firstName} readOnly />
        <p className="name">Last name</p>
        <input type="text" className="card-input read-only" value={lastName} readOnly />
        
      </div>
    </div>
  );
};

export default ProfileBox;






