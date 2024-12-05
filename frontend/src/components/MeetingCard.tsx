import React from "react";
import bin_icon from "../images/bin.png";
import clock_icon from "../images/clock.png";
import location_icon from "../images/location.png";
import person_icon from "../images/person.png";
import "../styles/MeetingCard.scss";

interface Props {
  title: string;
  status: string;
  dateTime: string; //Expected format: 2024-11-18, 15:30 - 18:00
  location: string;
  person: string;
}

const MeetingCard = ({ title, status, dateTime, location, person }: Props) => {
  return (
    <div className="meetingCard">
      <div className="card-title">
        <h2>{title}</h2>
        <button>
          <img src={bin_icon} alt="Bin Icon"></img>
        </button>
      </div>

      <div className={`card-status ${status.toLowerCase()}`}>{status}</div>

      <div className="card-description">
        <div className="card-info">
          <img src={clock_icon} alt="Clock Icon" />
          {dateTime}
        </div>
        <div className="card-info">
          <img src={location_icon} alt="Location Icon" />
          {location}
        </div>
        <div className="card-info">
          <img src={person_icon} alt="Person Icon" />
          {person}
        </div>
      </div>
    </div>
  );
};

export default MeetingCard;
