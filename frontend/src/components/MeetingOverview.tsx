import { Meeting } from "@shared/types/db/meeting";
import { useEffect, useState } from "react";

import "../styles/MeetingOverview.scss";

interface Props {
  meetingId?: Meeting["_id"] | null;
  title?: Meeting["title"];
  description?: Meeting["description"];
  endDate?: Meeting["repeat"]["endDate"];
}

const MeetingOverview = ({ meetingId = null }: Props) => {
  const [meetingInfo, setMeetingInfo] = useState<Meeting | null>(null);

  const fetchMeetingInfo = async () => {
    const url = `http://localhost:3007/meeting/${meetingId}`;

    await fetch(url, {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setMeetingInfo(data);
      })
      .catch((err) => {
        console.error("Error occurred:", err.message);
      });
  };

  useEffect(() => {
    fetchMeetingInfo();
  }, [meetingId]);

  return (
    <div className="meetingOverview roundShadowBorder">
      <div>
        <label>Title:</label>
        <input
          readOnly={meetingId !== null}
          className={meetingId !== null ? "grayInput textInput" : "textInput"}
          type="text"
          name="title"
          defaultValue={meetingInfo?.title}
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          readOnly={meetingId !== null}
          className={meetingId !== null ? "grayInput textInput" : "textInput"}
          name="description"
          defaultValue={meetingInfo?.description}
        />
      </div>
      <div className="frequency">
        <div>
          <label>Once</label>
          <input
            checked={meetingInfo?.repeat.type === 0}
            disabled={meetingId !== null}
            className="radioInput"
            type="radio"
            name="frequency"
            value="once"
          />
        </div>
        <div>
          <label>Every week</label>
          <input
            checked={meetingInfo?.repeat.type === 1}
            disabled={meetingId !== null}
            className="radioInput"
            type="radio"
            name="frequency"
            value="weekly"
          />
        </div>
        <div>
          <label>Ends at:</label>
          <input
            readOnly={meetingId !== null}
            className="grayInput textInput"
            type="text"
            name="end"
            defaultValue={meetingInfo?.repeat.endDate}
          />
        </div>
      </div>
    </div>
  );
};

export default MeetingOverview;
