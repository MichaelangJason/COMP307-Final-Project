import React from "react";
import { PollInfo } from "@shared/types/api/meeting";
import { MeetingRepeat } from "statusEnum";
import "../styles/CreateSt.scss";

interface CreateElementsProps {
  isPollRequired: boolean;
  setIsPollRequired: React.Dispatch<React.SetStateAction<boolean>>;
  setTimeoutInput: React.Dispatch<React.SetStateAction<PollInfo["timeout"]>>;
}

const CreateElements: React.FC<CreateElementsProps> = ({
  isPollRequired,
  setIsPollRequired,
  setTimeoutInput,
}) => {
  const pollFormat = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ismarked = e.target.checked;
    setIsPollRequired(ismarked);
  };

  return (
    <div className="meetingOverview roundShadowBorder">
      <div>
        <label>Title:</label>
        <input className="textInput" type="text" name="title" required />
      </div>
      <div>
        <label>Description:</label>
        <textarea className="textInput" name="description" required />
      </div>
      <div className="frequency">
        <div>
          <label>Once</label>
          <input
            className="radioInput"
            type="radio"
            name="frequency"
            value={0}
            required
          />
        </div>
        <div>
          <label>Every week</label>
          <input
            className="radioInput"
            type="radio"
            name="frequency"
            value={1}
          />
        </div>
        <div className="mn">
          <label>Ends at:</label>
          <input
            className="textInput"
            type="text"
            name="end"
            required
            placeholder="yyyy-mm-dd"
          />
        </div>

        <div className="pollRequired">
          <input
            className="checkbox"
            type="checkbox"
            onChange={pollFormat}
            style={{ marginLeft: "1px" }}
          />
          <div style={{ marginLeft: "0px" }}>
            <label>Poll required</label>
          </div>
        </div>

        <div className={`result ${!isPollRequired ? "readOnly" : ""}`}>
          <label>#Results:</label>
          <input
            type="text"
            readOnly={!isPollRequired}
            className={!isPollRequired ? "grayInput textInput" : "textInput"}
            name="rs"
            required={isPollRequired}
          />
        </div>

        <div className={`tm ${!isPollRequired ? "readOnly" : ""}`}>
          <label>Timeout:</label>
          <input
            type="text"
            name="tm"
            readOnly={!isPollRequired}
            className={!isPollRequired ? "grayInput textInput" : "textInput"}
            placeholder={!isPollRequired ? "" : "1d12h30m"}
            onChange={(e) => setTimeoutInput(e.target.value)}
            required={isPollRequired}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateElements;
