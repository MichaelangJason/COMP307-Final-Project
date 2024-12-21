import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Meeting, Participant } from "@shared/types/db/meeting";
import { MeetingRepeat, MeetingStatus } from "../statusEnum";
import MeetingOverview from "../components/MeetingOverview";
import MeetingDate from "../components/MeetingDate";
import MeetingParticipants from "../components/MeetingParticipants";
import Poll from "../components/Poll";

import "../styles/Edit.scss";
import SubmitButton from "../components/SubmitButton";

const Edit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const meetingId = params.meetingid;
  const hostId = params.id;
  const isAdmin = sessionStorage.getItem("role") === "0";

  const [availabilities, setAvailabilities] = useState<
    Meeting["availabilities"] | null
  >(null);
  const [meetingInfo, setMeetingInfo] = useState<Meeting | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const token = sessionStorage.getItem("token");

  const fetchMeetingInfo = useCallback(async () => {
    const url = `${(window as any).backendURL}meeting/${meetingId}`;

    await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
        setAvailabilities(data.availabilities);
        setMeetingInfo(data);
      })
      .catch((err) => {
        console.error("Error occurred:", err.message);
      });
  }, [meetingId, token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!availabilities || availabilities?.length === 0) {
      alert("No availabilities selected");
      return;
    }

    const url = `${(window as any).backendURL}meeting/${meetingId}`;

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

    if (repeatKeys["type"] === 0) {
      delete repeatKeys["endDate"];
    }

    const finalData = { ...formObject, repeat: repeatKeys, availabilities };

    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(finalData),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          const errorMessage = data.message || "Something went wrong";
          throw new Error(errorMessage);
        }
        return data;
      })
      .then(() => {
        window.alert("Meeting updated successfully");
        if (isAdmin) {
          navigate(`/admin/members/${hostId}/manage`);
        } else {
          navigate(`/user/${hostId}/manage`);
        }
      })
      .catch((err) => {
        console.error("Error occurred:", err.message);
        alert(`Error: ${err.message}`);
      });
  };

  const handleDelete = async () => {
    const url = `${(window as any).backendURL}meeting/${meetingId}`;

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
        return res.status === 204 ? null : res.json();
      })
      .then(() => {
        alert("Meeting deleted successfully");
        if (isAdmin) {
          navigate(`/admin/members/${hostId}/manage`);
        } else {
          navigate(`/user/${hostId}/manage`);
        }
      })
      .catch((err) => {
        console.error("Error occurred:", err.message);
        alert(`Error: ${err.message}`);
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
      <form id="edit-create" onSubmit={handleSubmit}>
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
