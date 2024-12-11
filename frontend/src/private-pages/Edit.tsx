import MeetingOverview from "components/MeetingOverview";

import "../styles/Edit.scss";

const Edit = () => {
  return (
    <>
      <h1>Edit Meeting</h1>
      <form id="edit">
        <MeetingOverview />
        <div className="dateContainer"></div>
        <div className="participantsContainer"></div>
        <div className="pollContainer"></div>
      </form>
    </>
  );
};

export default Edit;
