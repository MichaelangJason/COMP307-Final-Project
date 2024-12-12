import MeetingOverview from "components/MeetingOverview";
import MeetingDate from "components/MeetingDate";
import MeetingParticipants from "components/MeetingParticipants";

import "../styles/Edit.scss";

const Edit = () => {
  return (
    <>
      <h1>Edit Meeting</h1>
      <form id="edit">
        <MeetingOverview />
        <MeetingDate />
        <MeetingParticipants />
        <div className="pollContainer"></div>
      </form>
    </>
  );
};

export default Edit;
