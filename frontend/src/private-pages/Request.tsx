import { useState } from "react";

import RequestAccordion from "components/RequestAccordion";
import "../styles/Request.scss";

const Request = () => {
  const [filter, setFilter] = useState("All");
  return (
    <>
      <h1>Manage Requests</h1>
      <div id="request">
        <RequestAccordion
          status="pending"
          name="Eve Zhang"
          email="jiaju.nie@mail.mcgill.ca"
          date="2024-11-30"
          time="14:30"
          reason="bla bla bla bla bla bla bla"
        />
        <RequestAccordion
          status="pending"
          name="Yes Madam"
          email="jiaju.nie@mail.mcgill.ca"
          date="2024-11-30"
          time="14:30"
          reason="I think I’ve seen this film before, but I didn’t like the ending. Hey
          hey you you I dont like your girfriend, no why no why I think you need
          a new one."
          showButtons
        />
        <RequestAccordion
          status="accepted"
          name="Halo You"
          email="jiaju.nie@mail.mcgill.ca"
          date="2024-11-30"
          time="14:30"
          reason="bla bla bla bla bla bla bla"
        />
        <RequestAccordion
          status="expired"
          name="Yes Madam"
          email="jiaju.nie@mail.mcgill.ca"
          date="2024-11-30"
          time="14:30"
          reason="bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla"
          showButtons
        />
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
    </>
  );
};

export default Request;
