import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Request } from "@shared/types/db/request";
import { RequestStatus } from "../../src/statusEnum";
import RequestAccordion from "components/RequestAccordion";
import "../styles/Request.scss";

const RequestsPage = () => {
  const params = useParams();
  const id = params.id;
  const token = sessionStorage.getItem("token");

  const [filter, setFilter] = useState<4 | RequestStatus | 4>(4);
  const [requests, setRequests] = useState<Request[]>([]);

  const fetchRequests = useCallback(async () => {
    const url = `http://localhost:3007/user/requests/${id}`;

    await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          const errorMessage = data.message || "Something went wrong";
          throw new Error(errorMessage);
        }
        return data;
      })
      .then((data) => {
        setRequests(data.requests);
      })
      .catch((err) => {
        console.error("Error occurred:", err.message);
      });
  }, [id, token]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <>
      <h1>Manage Requests</h1>
      <div id="request">
        <div className="accordions">
          {requests
            .filter((req) => filter === 4 || req.status === filter)
            .map((data) => {
              const dateTime = new Date(data.createdAt)
                .toISOString()
                .split("T");

              return (
                <RequestAccordion
                  status={data.status}
                  name={`${data.proposerInfo.firstName} ${data.proposerInfo.lastName}`}
                  email={data.proposerInfo.email}
                  date={dateTime[0]}
                  time={dateTime[1].split(":").slice(0, 2).join(":")}
                  reason={data.reason}
                  requestId={data._id}
                  token={token}
                  onDecision={fetchRequests}
                />
              );
            })}
        </div>
        <div className="filter-options">
          <label>
            <input
              type="radio"
              name="filter"
              value="All"
              checked={filter === 4}
              onChange={() => setFilter(4)}
            />
            All
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="Expired"
              checked={filter === RequestStatus.EXPIRED}
              onChange={() => setFilter(RequestStatus.EXPIRED)}
            />
            Expired
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="Pending"
              checked={filter === RequestStatus.PENDING}
              onChange={() => setFilter(RequestStatus.PENDING)}
            />
            Pending
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="Accepted"
              checked={filter === RequestStatus.ACCEPTED}
              onChange={() => setFilter(RequestStatus.ACCEPTED)}
            />
            Accepted
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="Declined"
              checked={filter === RequestStatus.DECLINED}
              onChange={() => setFilter(RequestStatus.DECLINED)}
            />
            Declined
          </label>
        </div>
      </div>
    </>
  );
};

export default RequestsPage;
