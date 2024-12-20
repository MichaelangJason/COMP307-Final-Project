import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";

import { Request } from "@shared/types/db/request";
import { RequestStatus } from "../statusEnum";
import RequestStatusLabel from "./RequestStatusLabel";
import "../styles/RequestAccordion.scss";
import SubmitButton from "./SubmitButton";

interface Props {
  onDecision: () => void;
  status: RequestStatus;
  name: string;
  email: Request["proposerInfo"]["email"];
  date: string;
  time: string;
  reason: Request["reason"];
  requestId: Request["_id"];
  token: string | null;
}

const RequestAccordion = ({
  onDecision,
  status,
  name,
  email,
  date,
  time,
  reason,
  requestId,
  token,
}: Props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleApprove = async () => {
    const url = `http://localhost:3007/request/${requestId}`;

    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: RequestStatus.ACCEPTED }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          const errorMessage = data.message || "Something went wrong";
          throw new Error(errorMessage);
        }
        return data;
      })
      .then(() => {
        onDecision();
      })
      .catch((err) => {
        console.error("Error occurred:", err.message);
        alert(`Error: ${err.message}`);
      });
  };

  const handleDecline = async () => {
    const url = `http://localhost:3007/request/${requestId}`;

    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: RequestStatus.DECLINED }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          const errorMessage = data.message || "Something went wrong";
          throw new Error(errorMessage);
        }
        return data;
      })
      .then(() => {
        onDecision();
      })
      .catch((err) => {
        console.error("Error occurred:", err.message);
        alert(`Error: ${err.message}`);
      });
  };

  return (
    <div className="requestAccordion">
      <div className="visibleContent">
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? (
            <FontAwesomeIcon icon={faCaretDown} />
          ) : (
            <FontAwesomeIcon icon={faCaretRight} />
          )}
        </button>
        <div className="visibleInfo">
          <RequestStatusLabel status={status} />
          <label>{name}</label>
          <p>{email}</p>
          <p>
            {date} {time}
          </p>
        </div>
      </div>
      <div className={`hiddenContent ${isExpanded ? "show" : ""}`}>
        <label>Reason of Meeting:</label>
        <p>{reason}</p>
        {status === RequestStatus.PENDING && (
          <div className="decisionButtons">
            <SubmitButton
              className="declineButton"
              value="Decline"
              onClick={handleDecline}
            />
            <SubmitButton value="Approve" onClick={handleApprove} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestAccordion;
