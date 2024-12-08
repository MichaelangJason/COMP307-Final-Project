import React, { useState, useEffect } from "react";
import MeetingCard from "../components/MeetingCard";
import "../styles/MeetingsGrid.scss";
import { useLocation, useNavigate } from "react-router-dom";

interface Card {
  title: string;
  status: string;
  dateTime: string;
  location: string;
  person: string;
}

const Manage = () => {
  const [cards, setCards] = useState<Card[]>([]);
  // Filter
  const [filter, setFilter] = useState("All");
  //Edit
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      //const response = await fetch("http://localhost:5000/api/cards"); //is the URL the frontend sends the request; it refers to an API route on the backend server that provides data about meeting cards
      // const data = await response.json();

      // dummy example
      const data: Card[] = [
        {
          title: "COMP 307 Office Hours",
          status: "Upcoming",
          dateTime: "2024-11-18, 15:30 - 18:00",
          location: "MC24",
          person: "Jiaju Nie",
        },
        {
          title: "Team Meeting",
          status: "Voting",
          dateTime: "2024-11-15, 10:00 - 11:00",
          location: "LEA26",
          person: "User1",
        },
        {
          title: "COMP206 Team Meeting",
          status: "Closed",
          dateTime: "2024-11-18, 21:00 - 00:00",
          location: "Zoom",
          person: "User2",
        },
        {
          title: "COMP206 Office Hours",
          status: "Upcoming",
          dateTime: "2024-11-18, 09:00 - 10:00",
          location: "McConnel310",
          person: "User3",
        },
        {
          title: "Team Meeting",
          status: "Voting",
          dateTime: "2024-11-15, 10:00 - 11:00",
          location: "LEA26",
          person: "User1",
        },
        {
          title: "COMP206 Team Meeting",
          status: "Closed",
          dateTime: "2024-11-18, 21:00 - 00:00",
          location: "Zoom",
          person: "User2",
        },
        {
          title: "COMP206 Office Hours",
          status: "Voting",
          dateTime: "2024-11-18, 09:00 - 10:00",
          location: "McConnel310",
          person: "User3",
        },
      ];
      setCards(data);
    };

    fetchData();
  }, []);

  // Filter
  const filteredCards = cards.filter((card) => {
    if (filter === "All") return true;
    return card.status === filter;
  });

  // TODO : frontend - need to add a link to the Edit Page!!! - done
  // TODO : frontend - follow up to transfer data to Private 6!!!
  // TODO : backend - meeting id
  const handleEdit = (card: Card) => {
    const newPath = `${location.pathname}/:meetingid/edit`;
    navigate(newPath);
  };

  return (
    <>
      <h1>Manage Created Meetings</h1>
      <div className="meetings-page">
        <div className="card-list">
          {filteredCards.map((card, index) => (
            <MeetingCard
              key={index}
              title={card.title}
              status={card.status}
              dateTime={card.dateTime}
              location={card.location}
              person={card.person}
              canEdit={true} //Added
              onDelete={() => handleEdit(card)}
            />
          ))}
        </div>
        <div className="filter-options">
          <label>
            <input
              type="radio"
              name="filter"
              value="All"
              checked={filter === "All"}
              onChange={() => setFilter("All")}
            />
            All
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="Upcoming"
              checked={filter === "Upcoming"}
              onChange={() => setFilter("Upcoming")}
            />
            Upcoming
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="Voting"
              checked={filter === "Voting"}
              onChange={() => setFilter("Voting")}
            />
            Voting
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="Closed"
              checked={filter === "Closed"}
              onChange={() => setFilter("Closed")}
            />
            Closed
          </label>
        </div>
      </div>
    </>
  );
};

export default Manage;
