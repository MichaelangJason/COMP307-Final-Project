import { useState, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter
  const [filter, setFilter] = useState("All");
  // Pop up
  const [showPopup, setShowPopup] = useState(false); // Control popup visibility
  const [selectedCard, setSelectedCard] = useState<Card | null>(null); // Card to be deleted

  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    //only fetch if userId is available
    if (!userId) {
      setError("No user ID found");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("Fetching data for userId:", userId);
        const url = `http://localhost:3007/user/profile/${userId}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const userData = await response.json();
        console.log("Received user data:", userData);

        if (!userData.upcomingMeetings) {
          throw new Error("No meetings data found");
        }

        const meetings = userData.upcomingMeetings.map((meeting: any) => {
          console.log("Processing meeting:", meeting);

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
            id: meeting.meetingId,
            title: meeting.title,
            status: status,
            dateTime: `${meeting.date} ${meeting.time}`,
            location: meeting.location,
            person: `${meeting.hostFirstName} ${meeting.hostLastName}`,
          };
        });

        console.log("Processed meetings:", meetings);
        setCards(meetings);
      } catch (error) {
        console.error("Error fetching meetings:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch meetings"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Filter
  const filteredCards = cards.filter((card) => {
    if (filter === "All") return true;
    return card.status === filter;
  });

  console.log("Filtered cards:", filteredCards);

  // handle meeting deletion
  const handleDelete = async () => {
    if (!selectedCard) return;

    try {
      const [date, time] = selectedCard.dateTime.split(" ");

      const url_to_load_userData = `http://localhost:3007/user/profile/${userId}`;

      const responseName = await fetch(url_to_load_userData, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (!responseName.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await responseName.json(); //API returns { firstName, lastName }

      const url_to_delete_card = `http://localhost:3007/meeting/unbook/${selectedCard.id}`;

      const response = await fetch(url_to_delete_card, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },

        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          userId: userId,
          email: sessionStorage.getItem("email"),
          date: date,
          slot: time,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete meeting");
      }

      // Remove the meeting from the Array
      setCards((prevCards) =>
        prevCards.filter((card) => card.id !== selectedCard.id)
      );
      handleClosePopup();
    } catch (error) {
      console.error("Error deleting meeting:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete meeting"
      );
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

  if (isLoading) return <div>Loading meetings...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <h1>Meetings to Participate</h1>
      <div className="meetings-page">
        <div className="card-list">
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <MeetingCard
                key={card.id}
                title={card.title}
                status={card.status}
                dateTime={card.dateTime}
                location={card.location}
                person={card.person}
                canEdit={false}
                onDelete={() => handleShowPopup(card)}
              />
            ))
          ) : (
            <div>No meetings found</div>
          )}
        </div>
        <div className="filter-options">
          {["All", "Upcoming", "Live", "Closed", "Canceled"].map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="filter"
                value={option}
                checked={filter === option}
                onChange={() => setFilter(option)}
              />
              {option}
            </label>
          ))}
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
