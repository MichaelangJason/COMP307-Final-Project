import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/profileCard.scss";
import profilepic from "../images/profilepic.png";

const ProfileBox: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;
      try {
        const response = await fetch(`http://localhost:3007/user/profile/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setUserId(id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  return (
    <div className="box">
      <div className="box-container">
        <img className="box-image" src={profilepic} alt="Profile" />
        <div className="box-id">
          ID: {userId}
        </div>
      </div>
      <div className="inside">
        <p className="name">First Name</p>
        <input type="text" className="card-input read-only" value={firstName || ''} readOnly />
        <p className="name">Last Name</p>
        <input type="text" className="card-input read-only" value={lastName || ''} readOnly />
      </div>
    </div>
  );
};

export default ProfileBox;







