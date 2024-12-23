import MemberCard from "components/MemberCard";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/MembersGrid.scss";

interface Card {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  memberSince: string;
}

const Members = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter based on Domain : student or staff
  const [filter, setFilter] = useState("All");

  // Search Query
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false); // Track if search is triggered

  // Deletion Pop up
  const [showPopup, setShowPopup] = useState(false); // Control popup visibility
  const [selectedCard, setSelectedCard] = useState<Card | null>(null); // Card to be deleted

  // navigate
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = `${(window as any).backendURL}admin/members`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data); // Debug log

        const formattedCards = data.users.map((user: any) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          memberSince: user.createdAt, //Not found in the backend
        }));

        console.log("Formatted cards:", formattedCards); // Debug log
        setCards(formattedCards);
      } catch (error) {
        console.error("Failed to fetch members:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch members"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter by domain + Seatch Query
  const filteredCards = cards.filter((card) => {
    const matchesFilter =
      filter === "All" || card.email.split("@")[1] === filter;

    const matchesSearch =
      searchTriggered && // Apply search when the "search button is pressed"
      (card.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.email.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && (!searchTriggered || matchesSearch);
  });

  console.log("Filtered cards:", filteredCards); // Debug log

  // Filter options
  const handleFilterChange = (domain: string) => {
    setFilter(domain);
  };

  // Search Query
  const handleSearchClick = () => {
    setSearchTriggered(true); // Mark search as triggered
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSearchTriggered(false);
  };

  const handleDelete = async () => {
    if (selectedCard) {
      try {
        const response = await fetch(
          `${(window as any).backendURL}admin/members/${selectedCard.id}`,
          { 
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          // success deletion
          setCards(cards.filter((card) => card.id !== selectedCard.id));
          handleClosePopup();
        } else {
          console.error("Failed to delete member!");
        }
      } catch (error) {
        console.error("Error delting member:", error);
      }
    }
  };

  // TODO : navigate to the specific id
  const handleCardClick = (card: Card) => {
    const newPath = `${location.pathname}/${card.id}`;
    navigate(newPath);
  };

  const handleShowPopup = (card: Card, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event from triggering
    setSelectedCard(card);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedCard(null);
  };

  if (isLoading) return <div>Loading members...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="header-n-search">
        <h1>Members</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={handleSearchInputChange} //when there is a change, do nothing, unless admin pressed the search button
          />
          <button onClick={handleSearchClick}>Search</button>
        </div>
      </div>
      <div className="members-page">
        <div className="card-list">
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <div key={card.id} onClick={() => handleCardClick(card)}>
                <MemberCard
                  lastName={card.lastName}
                  firstName={card.firstName}
                  email={card.email}
                  memberSince={card.memberSince}
                  onDelete={(e) => handleShowPopup(card, e)}
                />
              </div>
            ))
          ) : (
            <div>No members found</div>
          )}
        </div>

        <div className="filter-options">
          <label>
            <input
              type="radio"
              name="filter"
              value="All"
              checked={filter === "All"}
              onChange={() => handleFilterChange("All")}
            />
            All
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="Student"
              checked={filter === "mail.mcgill.ca"}
              onChange={() => handleFilterChange("mail.mcgill.ca")}
            />
            Student
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="Staff"
              checked={filter === "mcgill.ca"}
              onChange={() => handleFilterChange("mcgill.ca")}
            />
            Staff
          </label>
        </div>
      </div>
      {showPopup && selectedCard && (
        <div className="popup">
          <div className="popup-content">
            <div className="popup-message">
              <strong>
                Are you sure you want to delete the member "
                {selectedCard.lastName}, {selectedCard.firstName} "?{" "}
              </strong>
              {/* <p>
                {selectedCard.status === "Upcoming" && (
                  <p>
                    Warning: Deleting self-hosting upcoming meetings will cancel
                    the meeting for all the registered participants.
                  </p>
                )}
              </p> */}
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

export default Members;
