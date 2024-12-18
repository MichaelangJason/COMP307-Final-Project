import React, { useState, useEffect } from "react";
import MeetingCard from "../components/MeetingCard";
import "../styles/MeetingsGrid.scss";
import { useLocation, useNavigate, useParams } from "react-router-dom";

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
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const userData = await response.json();

        const meetings = userData.hostedMeetings.map((meeting: any) => {
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
