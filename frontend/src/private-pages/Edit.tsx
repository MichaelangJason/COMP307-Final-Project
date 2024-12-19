import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MeetingUpdateBody } from "@shared/types/api/meeting";
import { Meeting, Participant } from "@shared/types/db/meeting";
import { MeetingRepeat, MeetingStatus } from "../statusEnum";
import MeetingOverview from "components/MeetingOverview";
import MeetingDate from "components/MeetingDate";
import MeetingParticipants from "components/MeetingParticipants";
import Poll from "components/Poll";

import "../styles/Edit.scss";
import SubmitButton from "components/SubmitButton";

const Edit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const meetingId = params.meetingid;

  const [availabilities, setAvailabilities] = useState<
    Meeting["availabilities"] | null
  >(null);
  const [meetingInfo, setMeetingInfo] = useState<Meeting | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const token = sessionStorage.getItem("token");

  const fetchMeetingInfo = useCallback(async () => {
    const url = `http://localhost:3007/meeting/${meetingId}`;

    await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setAvailabilities(data.availabilities);
        setMeetingInfo(data);
      })
      .catch((err) => {
        console.error("Error occurred:", err.message);
      });
  }, [meetingId, token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (availabilities?.length === 0) {
      alert("No availabilities selected");
      return;
    }

    const url = `http://localhost:3007/meeting/${meetingId}`;

    const formData = new FormData(e.currentTarget);

    const formObject: Record<string, string> = {};
    const repeatKeys: Record<string, string | MeetingRepeat> = {};

    formData.forEach((value, key) => {
      if (key === "frequency") {
        repeatKeys["type"] = Number(value);
        return;
      }
      if (key === "end") {
        repeatKeys["endDate"] = value as string;
        return;
      }
      formObject[key] = value as string;
    });

    const finalData = { ...formObject, repeat: repeatKeys, availabilities };

    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(finalData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        //navigate(-1);
        alert("Submitted!");
      })
      .catch((err) => {
        console.error("Error occurred:", err.message);
        alert("An error occurred. Please try again.");
      });
  };

  const handleDelete = async () => {
    const url = `http://localhost:3007/meeting/${meetingId}`;

    await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        //navigate(-1);
        alert("Deleted!");
      })
      .catch((err) => {
        console.error("Error occurred:", err.message);
        alert("An error occurred. Please try again.");
      });
  };

  const getDateParticipants = () => {
    const participantTimes = new Array<[string, Participant]>();

    Object.entries(
      availabilities?.find(
        (data) => data.date === selectedDate.toLocaleDateString("en-CA")
      )?.slots ?? {}
    ).forEach(([time, pArray]) =>
      pArray.forEach((participant) =>
        participantTimes.push([time, participant])
      )
    );

    return participantTimes;
  };

  useEffect(() => {
    fetchMeetingInfo();
  }, [fetchMeetingInfo]);

  return (
    <>
      <h1 style={{ marginBottom: "5px" }}>Edit Meeting</h1>
      <form id="edit" onSubmit={handleSubmit}>
        <MeetingOverview
          isModify={meetingInfo?.status !== MeetingStatus.VOTING}
          meetingId={meetingId}
        />
        <MeetingDate
          availabilities={availabilities}
          setAvailabilities={setAvailabilities}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          meetingInfo={meetingInfo}
          readOnly={meetingInfo?.status === MeetingStatus.VOTING}
          token={token}
        />
        <div>
          <h1>Participants</h1>
          <MeetingParticipants
            availabilities={availabilities}
            setAvailabilities={setAvailabilities}
            selectedDate={selectedDate}
            participants={getDateParticipants()}
            readOnly={meetingInfo?.status === MeetingStatus.VOTING}
          />
        </div>
        {meetingInfo?.pollInfo !== null && (
          <div>
            <h1>Poll Results</h1>
            <Poll pollContent={meetingInfo?.pollInfo.options} />
          </div>
        )}
        <div className="buttons">
          <SubmitButton
            className="submitButton delete"
            value="Delete"
            onClick={handleDelete}
            type="button"
          />
          {meetingInfo?.status !== MeetingStatus.VOTING && (
            <SubmitButton
              className="submitButton"
              value="Submit"
              type="submit"
            />
          )}
        </div>
      </form>
    </>
  );
};

export default Edit;
