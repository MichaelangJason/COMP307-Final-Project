import MeetingOverview from "components/MeetingOverview";
import MeetingDate from "components/MeetingDate";
import MeetingParticipants from "components/MeetingParticipants";
import Poll from "components/Poll";

import "../styles/Edit.scss";
import SubmitButton from "components/SubmitButton";

const Edit = () => {
  return (
    <>
      <h1 style={{ marginBottom: "5px" }}>Edit Meeting</h1>
      <form id="edit">
        <MeetingOverview />
        <MeetingDate />
        <div>
          <h1>Participants</h1>
          <MeetingParticipants />
        </div>
        <div>
          <h1>Poll Results</h1>
          <Poll pollContent={[]} />
        </div>
        <SubmitButton className="submitButton" value="Submit" />
      </form>
    </>
  );
};

export default Edit;
