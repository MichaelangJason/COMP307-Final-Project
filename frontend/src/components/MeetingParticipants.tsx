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
      <h1 style={{ margin: "0 0 20px 0" }}>Participants</h1>
      <div className="meetingParticipants roundShadowBorder">
        {participantsId.map((id) => (
          <ParticipantCard onDelete={() => handleDelete(id)} />
        ))}
      </div>
    </div>
  );
};

export default MeetingParticipants;
