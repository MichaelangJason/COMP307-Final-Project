import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MeetingCard from "../components/MeetingCard";
import "../styles/MeetingsGrid.scss";

import { MeetingStatus } from "../statusEnum";

interface Card {
  id: string;
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

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3007/user/profile/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const userData = await response.json();

        const meetings = userData.upcomingMeetings.map((meeting: any) => {
          // create start and end time Date
          const currentTime = new Date();
          const startTime = new Date(
            `${meeting.date} ${meeting.time.split("-")[0]}`
          );
          const endTime = new Date(
            `${meeting.date} ${meeting.time.split("-")[1]}`
          );

          // Determine the status based on the current time
          let status = "Upcoming";
          if (meeting.isCancelled) {
            status = "Canceled";
          } else if (currentTime >= startTime && currentTime <= endTime) {
            status = "Live";
          } else if (currentTime > endTime) {
            status = "Closed";
          }
          return {
            id: meeting.id,
            title: meeting.title,
            status: status,
            dateTime: `${meeting.date} ${meeting.time}`,
            location: meeting.location,
            person: `${meeting.hostFirstName} ${meeting.hostLastName}`,
          };
        });

        setCards(meetings);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    fetchData();
  }, [id]);

  // Filter
  const filteredCards = cards.filter((card) => {
    if (filter === "All") return true;
    return card.status === filter;
  });

  // handle meeting deletion
  const handleDelete = async () => {
    if (selectedCard) {
      try {
        const response = await fetch(
          `http://localhost:3007/meeting/cancel/${selectedCard.id}`, // Need to be fixed by Jiaju
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error("Failed to delete meeting");
        }

        // Remove the meeting from the Array
        setCards((prevCards) =>
          prevCards.filter((card) => card.id !== selectedCard.id)
        );
        setShowPopup(false);
        setSelectedCard(null);
      } catch (error) {
        console.error("Error deleting meeting:", error);
      }
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
