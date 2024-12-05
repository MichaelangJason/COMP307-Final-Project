import React, { useState, useEffect } from "react";
import MeetingCard from "../components/MeetingCard";
import "../styles/MeetingsGrid.scss";

interface Card {
  title: string;
  status: string;
  dateTime: string;
  location: string;
  person: string;
}

const Meetings = () => {
  const [cards, setCards] = useState<Card[]>([]);
  // Filter
  const [filter, setFilter] = useState("All");
  // Pop up
  const [showPopup, setShowPopup] = useState(false); // Control popup visibility
  const [selectedCard, setSelectedCard] = useState<Card | null>(null); // Card to be deleted

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
          status: "Live",
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
          status: "Canceled",
          dateTime: "2024-11-18, 09:00 - 10:00",
          location: "McConnel310",
          person: "User3",
        },
        {
          title: "Team Meeting",
          status: "Live",
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
          status: "Canceled",
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

  // Pop up
  const handleDelete = async () => {
    if (selectedCard) {
      // TODO backend : fetch
      const response = await fetch(`URL_link_here`, {
        method: "DELETE",
        // TODO backend ....
      });
      console.error("Failed to delete meeting");

      // TODO backend : handle response error from DB
    }
  };

  const handleShowPopup = (card: Card) => {
    setSelectedCard(card);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedCard(null);
  };

  return (
    <>
      <h1>Meetings to Participate</h1>
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
              canEdit={false} //Added
              onDelete={() => handleShowPopup(card)}
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
              value="Live"
              checked={filter === "Live"}
              onChange={() => setFilter("Live")}
            />
            Live
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
          <label>
            <input
              type="radio"
              name="filter"
              value="Canceled"
              checked={filter === "Canceled"}
              onChange={() => setFilter("Canceled")}
            />
            Canceled
          </label>
        </div>
      </div>

      {showPopup && selectedCard && (
        <div className="popup">
          <div className="popup-content">
            <div className="popup-message">
              <strong>
                {" "}
                Are you sure you want to delete "{selectedCard.title}"?{" "}
              </strong>
              <p>
                {selectedCard.status === "Upcoming" && (
                  <p>
                    Warning: Deleting self-hosting upcoming meetings will cancel
                    the meeting for all the registered participants.
                  </p>
                )}
              </p>
            </div>
            <div className="popup-buttons">
              <button onClick={handleClosePopup}> Cancel </button>
              <button onClick={handleDelete}> Delete </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Meetings;
