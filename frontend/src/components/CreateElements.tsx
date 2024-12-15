import React, { useState } from "react";
import "../styles/CreateSt.scss";

interface CreateElementsProps {
  ppoll: (isPollRequired: boolean) => void;
  setTimeoutInput: (timeout: string) => void;
}

const CreateElements: React.FC<CreateElementsProps> = ({ ppoll, setTimeoutInput }) => {
  const [fixDate, setFixDate] = useState<string>("");
  const [timeoutInputValue, setTimeout] = useState<string>("");
  const [placeholder, setPlaceholder] = useState<string>("mm/dd/yyyy");

  const [checkPoll, fixPoll] = useState<boolean>(false);

  const setEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date_input = e.target.value;
    const contains_characters = /^(0[1-9]|1[0-2])?(\/(0[1-9]|[12][0-9]|3[01])?)?(\/\d{0,4})?$/;

    if (contains_characters.test(date_input)) {
      setFixDate(date_input);
      setPlaceholder("");
    } else {
      console.log("Not correct format");
    }
  };

  const remainOutput = () => {
    const contains_characters = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!contains_characters.test(fixDate) && fixDate !== "") {
      console.log("Invalid format. Please use mm/dd/yyyy");
    }
  };

  const updateTimeout = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeoutInput = e.target.value;
    const validFormat = /^(\d+d)?(\d+h)?(\d+m)?$/;

    if (validFormat.test(timeoutInput)) {
      setTimeout(timeoutInput);
      setTimeoutInput(timeoutInput); 
    } else {
      console.log("Use 1d2h30m");
    }
  };

  const pollFormat = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ismarked = e.target.checked;
    fixPoll(ismarked);
    ppoll(ismarked); 
  };

  return (
    <div className="meetingOverview roundShadowBorder">
      <div>
        <label>Title:</label>
        <input className="textInput" type="text" name="title" />
      </div>
      <div>
        <label>Description:</label>
        <textarea className="textInput" name="description" />
      </div>
      <div className="frequency">
        <div>
          <label>Once</label>
          <input className="radioInput" type="radio" name="frequency" value="once" />
        </div>
        <div>
          <label>Every week</label>
          <input className="radioInput" type="radio" name="frequency" value="weekly" />
        </div>
        <div className="mn">
          <label>Ends at:</label>
          <input
            className="textInput"
            type="text"
            name="end"
            onBlur={remainOutput}
            onChange={setEndDate}
            placeholder={placeholder}
          />
        </div>
        <div className="pollRequired">
          <label>Poll required</label><br />
          <input className="checkbox" type="checkbox" onChange={pollFormat} /><br />
        </div>
        <div className="result">
          <label>#Results:</label>
          <input type="text" name="rs" className="textInput" />
        </div>
        <div className="tm">
          <label>Timeout:</label>
          <input
            type="text"
            name="rs"
            className="textInput"
            onChange={updateTimeout}
            value={timeoutInputValue}
            placeholder="1d12h30m"
          />
        </div>
      </div>
    </div>
  );
};

export default CreateElements;






