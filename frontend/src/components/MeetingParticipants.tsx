import { useState } from "react";
import ParticipantCard from "./ParticipantCard";

import "../styles/MeetingParticipants.scss";

const MeetingParticipants = () => {
  const [participantsId, setParticipantsId] = useState<number[]>([
    123, 345, 789, 101112,
  ]);

  const handleDelete = (id: number) => {
    setParticipantsId((prevParticipantsId) =>
      prevParticipantsId.filter((pid) => pid != id)
    );
  };

  return (
    <div>
      <div className="meetingParticipants roundShadowBorder">
        {participantsId.length > 0 ? (
          participantsId.map((id) => (
            <ParticipantCard onDelete={() => handleDelete(id)} />
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
