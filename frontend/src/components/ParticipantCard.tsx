import { Participant } from "@shared/types/db/meeting";
import bin from "../images/bin.png";

import "../styles/ParticipantCard.scss";

interface Props {
  firstName: Participant["firstName"];
  lastName: Participant["lastName"];
  email: Participant["email"];
  slot: string;
  onDelete: () => void;
  readOnly: boolean;
}

const ParticipantCard = ({
  firstName,
  lastName,
  email,
  slot,
  onDelete,
  readOnly,
}: Props) => {
  return (
    <div className="participantCard">
      <div className="firstLine">
        <p>
          {firstName} {lastName}
        </p>
        {!readOnly && <img onClick={onDelete} alt="delete" src={bin} />}
      </div>
      <p>{email}</p>
      <p>{slot}</p>
    </div>
  );
};

export default ParticipantCard;
