import React from "react";
import bin_icon from "../images/bin.png";
import "../styles/MemberCard.scss";

interface MemberCardProps {
  lastName: string;
  firstName: string;
  email: string;
  memberSince: string;
  onDelete?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void; //Callback fct
}

const MemberCard = ({
  lastName,
  firstName,
  email,
  memberSince,
  onDelete,
}: MemberCardProps) => {
  return (
    <div className="memberCard">
      <div className="card-title">
        <h2>
          {lastName}, {firstName}
        </h2>
        <button onClick={onDelete}>
          {" "}
          {/* This triggers the delete action */}
          <img src={bin_icon} alt="Bin Icon"></img>
        </button>
      </div>

      <div className="card-description">
        <div className="card-info">{email}</div>
        <div className="card-info">Member Since: {memberSince}</div>
      </div>
    </div>
  );
};

export default MemberCard;
