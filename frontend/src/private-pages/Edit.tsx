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
          <Poll
            pollContent={[
              {
                date: "February 3, 2024 (Monday)",
                times: [
                  ["12:00", "12:30", false, true],
                  ["12:00", "12:30", false, false],
                ],
              },
              {
                date: "February 6, 2024 (Tuesday)",
                times: [
                  ["12:00", "12:30", false, true],
                  ["12:00", "12:30", false, false],
                  ["12:00", "12:30", false, false],
                  ["12:00", "12:30", false, false],
                  ["12:00", "12:30", false, false],
                ],
              },
              {
                date: "February 8, 2024 (Thursday)",
                times: [["12:00", "12:30", false, false]],
              },
            ]}
          />
        </div>
        <SubmitButton
          className="submitButton"
          value="Submit"
          onSubmit={() => console.log("submit")}
        />
      </form>
    </>
  );
};

export default Edit;
