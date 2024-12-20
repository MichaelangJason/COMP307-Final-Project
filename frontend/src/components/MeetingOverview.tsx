import { Meeting } from "@shared/types/db/meeting";
import { useCallback, useEffect, useState } from "react";
import { MeetingRepeat } from "statusEnum";
import "../styles/MeetingOverview.scss";

interface Props {
  meetingId?: Meeting["_id"] | string | null;
  isModify?: boolean;
}

const MeetingOverview = ({ meetingId = null, isModify = false }: Props) => {
  const [meetingInfo, setMeetingInfo] = useState<Meeting | null>(null);
  const [frequency, setFrequency] = useState<MeetingRepeat>(0);

  const fetchMeetingInfo = useCallback(async () => {
    const url = `http://localhost:3007/meeting/${meetingId}`;

    await fetch(url, {
      method: "GET",
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          const errorMessage = data.message || "Something went wrong";
          throw new Error(errorMessage);
        }
        return data;
      })
      .then((data) => {
        setMeetingInfo(data);
      })
      .catch((err) => {
        console.error("Error occurred:", err.message);
      });
  }, [meetingId]);

  useEffect(() => {
    fetchMeetingInfo();
  }, [meetingId, fetchMeetingInfo]);

  return (
    <div className="meetingOverview roundShadowBorder">
      <div>
        <label>Title:</label>
        <input
          readOnly={meetingId !== null && !isModify}
          className={
            meetingId !== null && !isModify
              ? "grayInput textInput"
              : "textInput"
          }
          type="text"
          name="title"
          defaultValue={meetingInfo?.title}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          readOnly={meetingId !== null && !isModify}
          className={
            meetingId !== null && !isModify
              ? "grayInput textInput"
              : "textInput"
          }
          name="description"
          defaultValue={meetingInfo?.description}
          required
        />
      </div>
      <div className="frequency">
        <div>
          <label>Once</label>
          <input
            key={
              meetingInfo?.repeat.type === 0 ? "once-checked" : "once-unchecked"
            }
            defaultChecked={meetingInfo?.repeat.type === 0}
            disabled={meetingId !== null && !isModify}
            className="radioInput"
            type="radio"
            name="frequency"
            value={0}
            required
            onClick={() => setFrequency(0)}
          />
        </div>
        <div>
          <label>Every week</label>
          <input
            key={
              meetingInfo?.repeat.type === 1
                ? "weekly-checked"
                : "weekly-unchecked"
            }
            defaultChecked={meetingInfo?.repeat.type === 1}
            disabled={meetingId !== null && !isModify}
            className="radioInput"
            type="radio"
            name="frequency"
            value={1}
            onClick={() => setFrequency(1)}
          />
        </div>
        <div>
          <label>Ends at:</label>
          <input
            readOnly={(meetingId !== null && !isModify) || frequency === 0}
            className={
              (meetingId !== null && !isModify) || frequency === 0
                ? "grayInput textInput"
                : "textInput"
            }
            type="text"
            name="end"
            defaultValue={meetingInfo?.repeat.endDate}
            required={frequency === 1}
          />
        </div>
      </div>
    </div>
  );
};

export default MeetingOverview;
