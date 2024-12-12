import MeetingOverview from "components/MeetingOverview";

import "../styles/MeetingPoll.scss";
import Poll from "components/Poll";

const MeetingPoll = () => {
  return (
    <div id="meetingPoll">
      <div>
        <h1>Meeting Details</h1>
        <MeetingOverview readOnly />
      </div>
      <div>
        <h1>Poll</h1>
        <Poll
          pollContent={[
            {
              date: "February 3, 2024 (Monday)",
              times: [
                ["12:00", "12:30", true, false],
                ["12:00", "12:30", true, false],
              ],
            },
            {
              date: "February 6, 2024 (Tuesday)",
              times: [
                ["12:00", "12:30", true, false],
                ["12:00", "12:30", true, false],
                ["12:00", "12:30", true, false],
                ["12:00", "12:30", true, false],
                ["12:00", "12:30", true, false],
              ],
            },
            {
              date: "February 8, 2024 (Thursday)",
              times: [["12:00", "12:30", true, false]],
            },
          ]}
        />
      </div>
    </div>
  );
};

export default MeetingPoll;
