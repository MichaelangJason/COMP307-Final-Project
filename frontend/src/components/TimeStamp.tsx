import deleteIcon from "../images/red_x.png";

import "../styles/TimeStamp.scss";

interface Props {
  start: string;
  end: string;
  onDelete: () => void;
  readOnly: boolean;
}

const TimeStamp = ({ start, end, onDelete, readOnly }: Props) => {
  return (
    <div className="timeStamp">
      {start} - {end}
      {readOnly && (
        <img onClick={onDelete} src={deleteIcon} className="xIcon" />
      )}
    </div>
  );
};

export default TimeStamp;
