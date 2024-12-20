import React, { useState, useEffect } from "react";
import MeetingCard from "../components/MeetingCard";
import "../styles/MeetingsGrid.scss";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MeetingInfoWithHost } from "@shared/types/api/meeting";

interface Card {
  title: string;
  status: string;
  dateTime: string;
  location: string;
  person: string;
}
const userId = sessionStorage.getItem("userId");

const Manage = () => {
  const [cards, setCards] = useState<Card[]>([]);
  // Filter
  const [filter, setFilter] = useState("All");
  //Edit
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3007/user/profile/${userId}`,
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
        console.log(`userData : ${userData}`);

        // For each hostedMeeting Id call GET `http://localhost:3007/meeting/${meetingId}` to get meeting info
        const meetings = await Promise.all(
          userData.hostedMeetings.map(async (meetingId: string) => {
            console.log(meetingId);

            const meetingResponse = await fetch(
              `http://localhost:3007/meeting/${meetingId}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
              }
            );
            if (!meetingResponse.ok) {
              throw new Error("Failed to fetch meeting details");
            }

            const meeting: MeetingInfoWithHost = await meetingResponse.json();
            console.log(`meeting : ${meeting.availabilities[0]["date"]}`);

            // NOw need to fetch host firstName, lastName
            const hostResponse = await fetch(
              `http://localhost:3007/user/profile/${meeting.hostId}`,
              {
                method: "GET", // Assuming POST is used to fetch host details
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
              }
            );
            if (!hostResponse.ok) {
              throw new Error("Failed to fetch host details");
            }

            const hostDetails = await hostResponse.json();
            console.log(`hostDetails: ${hostDetails}`);

            // Combine meeting details with host details
            return {
              meetingId: meeting.meetingId,
              title: meeting.title,
              status: meeting.status,
              dateTime: meeting["availabilities"][0]["date"] || "N/A", // Example, pick the startDate from availabilities
              location: meeting.location,
              person: `${hostDetails.firstName} ${hostDetails.lastName}`, // Concatenate host first and last name
            };
          })
        );

        meetings.forEach((m) => console.log("dateTime" + m.dateTime));

        // Assuming the response for each meeting contains a card-like structure
        const mappedCards = meetings.map((meeting: any) => ({
          meetingId: meeting.meetingId,
          title: meeting.title,
          status: meeting.status,
          dateTime: meeting.dateTime || "N/A",
          location: meeting.location,
          person: meeting.hostd,
        }));

        mappedCards.forEach((e) => e.dateTime);

        setCards(mappedCards);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    fetchData();
  }, [userId]);

  // Filter
  const filteredCards = cards.filter((card) => {
    if (filter === "All") return true;
    return card.status === filter;
  });

  // TODO : frontend - need to add a link to the Edit Page!!! - done
  // TODO : frontend - follow up to transfer data to Private 6!!!
  // TODO : backend - meeting id
  const handleEdit = (card: Card) => {
    const newPath = `${location.pathname}/${(card as any).meetingId}/edit`;
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
              status={"Upcoming"} //card.status
              dateTime={"N/A"} //card.dateTime
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
