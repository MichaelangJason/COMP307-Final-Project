import bin from "../images/bin.png";

import "../styles/ParticipantCard.scss";

interface Props {
  onDelete: () => void;
}

const ParticipantCard = ({ onDelete }: Props) => {
  return (
    <div className="participantCard">
      <div className="firstLine">
        <p>First Name, Last Name</p>
        <img onClick={onDelete} src={bin} />
      </div>
      <p>example@mail.mcill.ca</p>
      <p>hh:mm - hh:mm</p>
    </div>
  );
};

export default ParticipantCard;
