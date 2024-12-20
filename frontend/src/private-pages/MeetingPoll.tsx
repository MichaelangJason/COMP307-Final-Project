import MeetingOverview from "components/MeetingOverview";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

import { Meeting } from "@shared/types/db/meeting";
import { Poll as PollType } from "@shared/types/db/poll";
import "../styles/MeetingPoll.scss";

import Poll from "components/Poll";
import SubmitButton from "components/SubmitButton";

const MeetingPoll = () => {
  const params = useParams();
  const pollId = params.id;

  const [meetingId, setMeetingId] = useState<Meeting["_id"] | null>(null);
  const [pollOptions, setPollOptions] = useState<PollType["options"]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const url = `http://localhost:3007/poll/${pollId}`;

    const formData = new FormData(e.currentTarget);

    const formObject: Record<string, string> = {};
    formData.forEach((value, key) => {
      formObject[key] = value as string;
    });

    for (const [date, time] of Object.entries(formObject)) {
      try {
        const res = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ date, slot: time }),
        });

        const data = await res.json();

        if (!res.ok) {
          const errorMessage = data.message || "Something went wrong";
          throw new Error(errorMessage);
        }
      } catch (err) {
        const error = err as Error;
        console.error("Error occurred:", error.message);
        alert("An error occurred. Please try again.");
        return;
      }
    }

    alert("Submitted!");
  };

  const fetchPollInfo = useCallback(async () => {
    const url = `http://localhost:3007/poll/${pollId}`;

    await fetch(url, {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          const errorMessage = data.message || "Something went wrong";
          throw new Error(errorMessage);
        }
        return data;
      })
      .catch((err) => {
        console.error("Error occurred:", err.message);
      });
  }, [pollId]);

  useEffect(() => {
    fetchPollInfo();
  }, [fetchPollInfo]);

  return (
    <div id="meetingPoll">
      <div>
        <h1>Meeting Details</h1>
        <MeetingOverview meetingId={meetingId} />
      </div>
      <form onSubmit={handleSubmit}>
        <h1>Poll</h1>
        <Poll pollContent={pollOptions} toChoose />
        <SubmitButton className="submitButton" value="Submit" />
      </form>
    </div>
  );
};

export default MeetingPoll;
