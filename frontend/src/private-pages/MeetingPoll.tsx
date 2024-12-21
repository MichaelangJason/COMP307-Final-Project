// Han Wen Fu

import MeetingOverview from "../components/MeetingOverview";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Poll as PollType } from "@shared/types/db/poll";
import "../styles/MeetingPoll.scss";

import Poll from "../components/Poll";
import SubmitButton from "../components/SubmitButton";

const MeetingPoll = () => {
  const params = useParams();
  const meetingId = params.id;

  // const [meetingId, setMeetingId] = useState<Meeting["_id"] | null>(null);
  const [pollOptions, setPollOptions] = useState<PollType["options"]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const url = `${(window as any).backendURL}poll/${meetingId}`;

    const formData = new FormData(e.currentTarget);

    const formObject: Record<string, string> = {};
    formData.forEach((value, key) => {
      formObject[key] = value as string;
    });
    const slot = formData.get("slot");

    if (!slot) {
      alert("Please select a slot");
      return;
    }

    const [date, time] = (slot as any).split(" ");

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date, slot: time }),
      });

      const data = await res.json();

      console.log(res);

      if (!res.ok) {
        const errorMessage = data.message || "Something went wrong";
        throw new Error(errorMessage);
      }

      alert("Voted!")
    } catch (err) {
      const error = err as Error;
      console.error("Error occurred:", error.message);
      alert("An error occurred. Please try again.");
      return;
    }
  };

  const fetchPollInfo = useCallback(async () => {
    const url = `${(window as any).backendURL}poll/${meetingId}`;

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
        // setMeetingId(data.meetingId);
        // setPollId(data.pollId);
        setPollOptions(data.options);
      })
      .catch((err) => {
        console.error("Error occurred:", err.message);
      });
  }, [meetingId]);

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
