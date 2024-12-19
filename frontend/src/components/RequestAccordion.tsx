import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";

import { Request } from "@shared/types/db/request";
import { RequestStatus } from "../../src/statusEnum";
import RequestStatusLabel from "./RequestStatusLabel";
import "../styles/RequestAccordion.scss";
import SubmitButton from "./SubmitButton";

interface Props {
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
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        alert("Submitted!");
      })
      .catch((err) => {
        console.error("Error occurred:", err.message);
        alert("An error occurred. Please try again.");
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
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        alert("Submitted!");
      })
      .catch((err) => {
        console.error("Error occurred:", err.message);
        alert("An error occurred. Please try again.");
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
