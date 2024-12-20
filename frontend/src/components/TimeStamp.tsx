import deleteIcon from "../images/red_x.png";

import "../styles/TimeStamp.scss";

interface Props {
  time: string;
  onDelete: () => void;
  readOnly?: boolean;
}

const TimeStamp = ({ time, onDelete, readOnly = false }: Props) => {
  return (
    <div className="timeStamp">
      {time}
      {!readOnly && (
        <img onClick={onDelete} alt="delete" src={deleteIcon} className="xIcon" />
      )}
    </div>
  );
};

export default TimeStamp;
