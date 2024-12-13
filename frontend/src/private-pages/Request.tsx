import { useState } from "react";

import RequestAccordion from "components/RequestAccordion";
import "../styles/Request.scss";

interface RequestAccordion {
  status: "expired" | "pending" | "accepted";
  name: string;
  email: string;
  date: string;
  time: string;
  reason: string;
  showButtons: boolean;
}

const Request = () => {
  const [filter, setFilter] = useState<"all" | RequestAccordion["status"]>(
    "all"
  );

  const requestAccordions: RequestAccordion[] = [
    {
      status: "pending",
      name: "Eve Zhang",
      email: "jiaju.nie@mail.mcgill.ca",
      date: "2024-11-30",
      time: "14:30",
      reason: "bla bla bla bla bla bla bla",
      showButtons: false,
    },
    {
      status: "pending",
      name: "Yes Madam",
      email: "jiaju.nie@mail.mcgill.ca",
      date: "2024-11-30",
      time: "14:30",
      reason:
        "I think I’ve seen this film before, but I didn’t like the ending. Hey hey you you I dont like your girlfriend, no why no why I think you need a new one.",
      showButtons: true,
    },
    {
      status: "accepted",
      name: "Halo You",
      email: "jiaju.nie@mail.mcgill.ca",
      date: "2024-11-30",
      time: "14:30",
      reason: "bla bla bla bla bla bla bla",
      showButtons: false,
    },
    {
      status: "expired",
      name: "Yes Madam",
      email: "jiaju.nie@mail.mcgill.ca",
      date: "2024-11-30",
      time: "14:30",
      reason:
        "bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla",
      showButtons: true,
    },
  ];

  return (
    <>
      <h1>Manage Requests</h1>
      <div id="request">
        <div className="accordions">
          {requestAccordions
            .filter((accordion) => filter === "all" || accordion.status === filter)
            .map((data) => (
              <RequestAccordion
                status={data.status}
                name={data.name}
                email={data.email}
                date={data.date}
                time={data.time}
                reason={data.reason}
                showButtons={data.showButtons}
              />
            ))}
        </div>
        <div className="filter-options">
          <label>
            <input
              type="radio"
              name="filter"
              value="All"
              checked={filter === "all"}
              onChange={() => setFilter("all")}
            />
            All
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="Expired"
              checked={filter === "expired"}
              onChange={() => setFilter("expired")}
            />
            Expired
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="Pending"
              checked={filter === "pending"}
              onChange={() => setFilter("pending")}
            />
            Pending
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="Accepted"
              checked={filter === "accepted"}
              onChange={() => setFilter("accepted")}
            />
            Accepted
          </label>
        </div>
      </div>
    </>
  );
};

export default Request;
