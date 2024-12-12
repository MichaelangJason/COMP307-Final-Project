import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";

import RequestStatus from "./RequestStatus";
import "../styles/RequestAccordion.scss";
import SubmitButton from "./SubmitButton";

interface Props {
  status: "expired" | "pending" | "accepted";
  name: string;
  email: string;
  date: string;
  time: string;
  reason: string;
  showButtons?: boolean;
}

const RequestAccordion = ({
  status,
  name,
  email,
  date,
  time,
  reason,
  showButtons = false,
}: Props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

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
          <RequestStatus status={status} />
          <label>{name}</label>
          <p>{email}</p>
          <p>
            {date} {time}
          </p>
        </div>
      </div>
      <div className={`hiddenContent ${isExpanded ? "show" : ""}`}>
        <label>Reason of Meeting:</label>
        <p>
          {reason}
        </p>
        {showButtons && (
          <div className="decisionButtons">
            <SubmitButton
              className="declineButton"
              value="Decline"
              onSubmit={() => console.log("decline")}
            />
            <SubmitButton
              value="Approve"
              onSubmit={() => console.log("decline")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestAccordion;
