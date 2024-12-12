import "../styles/MeetingOverview.scss";

const MeetingOverview = () => {
  return (
    <div className="meetingOverview roundShadowBorder">
      <div>
        <label>Title:</label>
        <input className="grayInput textInput" type="text" name="title" />
      </div>
      <div>
        <label>Description:</label>
        <textarea className="grayInput textInput" name="description" />
      </div>
      <div className="frequency">
        <div>
          <label>Once</label>
          <input
            className="radioInput"
            type="radio"
            name="frequency"
            value="once"
          />
        </div>
        <div>
          <label>Every week</label>
          <input
            className="radioInput"
            type="radio"
            name="frequency"
            value="weekly"
          />
        </div>
        <div className="readOnly">
          <label>Ends at:</label>
          <input readOnly className="grayInput textInput" type="text" name="end" />
        </div>
      </div>
    </div>
  );
};

export default MeetingOverview;
