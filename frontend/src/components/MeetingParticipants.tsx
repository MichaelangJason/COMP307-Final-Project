// Han Wen Fu

import { useEffect, useState } from "react";
import ParticipantCard from "./ParticipantCard";
import { Meeting, Participant } from "@shared/types/db/meeting";

import "../styles/MeetingParticipants.scss";

interface Props {
  availabilities: Meeting["availabilities"] | null;
  setAvailabilities: React.Dispatch<
    React.SetStateAction<Meeting["availabilities"] | null>
  >;
  selectedDate: Date;
  participants: [string, Participant][];
  readOnly: boolean;
}

const MeetingParticipants = ({
  availabilities,
  setAvailabilities,
  selectedDate,
  participants,
  readOnly,
}: Props) => {
  const [participantsState, setParticipantsState] =
    useState<[string, Participant][]>(participants);

  const handleDelete = (email: Participant["email"]) => {
    setParticipantsState((prevParticipantsState) =>
      prevParticipantsState.filter((p) => p[1].email !== email)
    );

    const selectedAvailability = availabilities?.find(
      (a) => a.date === selectedDate.toLocaleDateString("en-CA")
    );

    if (selectedAvailability !== undefined) {
      const updatedSlots = { ...selectedAvailability.slots };

      for (const time in updatedSlots) {
        if (Object.hasOwn(updatedSlots, time)) {
          updatedSlots[time] = updatedSlots[time].filter(
            (participant: Participant) => participant.email !== email
          );
        }
      }

      setAvailabilities((prevAvailabilities) =>
        (prevAvailabilities || []).map((availability) =>
          availability.date === selectedAvailability.date
            ? { ...availability, slots: updatedSlots }
            : availability
        )
      );
    }
  };

  useEffect(() => {
    setParticipantsState(participants);
  }, [participants]);

  return (
    <div>
      <div className="meetingParticipants roundShadowBorder">
        {participantsState.length > 0 ? (
          participantsState.map((p) => (
            <ParticipantCard
              firstName={p[1].firstName}
              lastName={p[1].lastName}
              email={p[1].email}
              slot={p[0]}
              onDelete={() => handleDelete(p[1].email)}
              readOnly={readOnly}
            />
          ))
        ) : (
          <div
            style={{
              textAlign: "center",
              width: "100%",
              fontSize: "20px",
            }}
          >
            No participants
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingParticipants;
