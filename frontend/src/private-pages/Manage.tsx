import { useState, useEffect } from "react";
import MeetingCard from "../components/MeetingCard";
import "../styles/MeetingsGrid.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { MeetingInfoWithHost } from "@shared/types/api/meeting";

interface Card {
  meetingId: string; //This is needed for navigation
  title: string;
  status: string;
  dateTime: string;
  location: string;
  person: string;
}

const Manage = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter
  const [filter, setFilter] = useState("All");

  //navigate
  const navigate = useNavigate();
  const location = useLocation();
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setError("No user ID found");
        setIsLoading(false);
        return;
      }

      try {
        const url_fetch_user_profile = `http://localhost:3007/user/profile/${userId}`;

        const response = await fetch(url_fetch_user_profile, {
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
        console.log("User Data:", userData); // for debugging

        if (!userData.hostedMeetings) {
          throw new Error("No hosted meetings found");
        }

        // Fetch meeting details
        const meetings = await Promise.all(
          userData.hostedMeetings.map(async (meetingId: string) => {
            console.log("Fetching meeting:", meetingId);

            const url = `http://localhost:3007/meeting/${meetingId}`;

            const meetingResponse = await fetch(url, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
            });

            if (!meetingResponse.ok) {
              throw new Error(`Failed to fetch meeting ${meetingId}`);
            }

            const meeting: MeetingInfoWithHost = await meetingResponse.json();
            console.log("Meeting Data:", meeting);

            console.log("Meeting status: ", meeting.status);

            // Fetch host details
            const url_fetch_host_info = `http://localhost:3007/user/profile/${meeting.hostId}`;

            const hostResponse = await fetch(url_fetch_host_info, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
            });

            if (!hostResponse.ok) {
              throw new Error("Failed to fetch host details");
            }

            const hostDetails = await hostResponse.json();
            console.log("Host Details:", hostDetails); // Debug

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

        // meetings.forEach((m) => console.log("dateTime" + m.dateTime));
        console.log("Processed Meetings:", meetings); // Debug

        // Assuming the response for each meeting contains a card-like structure
        setCards(meetings); // Use the meetings directly instead of mapping again
        setIsLoading(false);

        // mappedCards.forEach((e) => e.dateTime);
      } catch (error) {
        console.error("Error fetching meetings:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch meetings"
        );
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

  const handleEdit = (card: Card) => {
    // const newPath = `${location.pathname}/${(card as any).meetingId}/edit`;
    const newPath = `${location.pathname}/${card.meetingId}/edit`;
    navigate(newPath);
  };

  if (isLoading) return <div>Loading meetings...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <h1>Manage Created Meetings</h1>
      <div className="meetings-page">
        <div className="card-list">
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <MeetingCard
                key={card.meetingId}
                title={card.title}
                status={card.status} //card.status
                dateTime={card.dateTime} //card.dateTime
                location={card.location}
                person={card.person}
                canEdit={true}
                onDelete={() => handleEdit(card)}
              />
            ))
          ) : (
            <div>
              No meetings found. Please go to the CREAT page to host a meeting.
            </div>
          )}
        </div>
        <div className="filter-options">
          {["All", "Upcoming", "Voting", "Closed"].map((option) => (
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
    </>
  );
};

export default Manage;
