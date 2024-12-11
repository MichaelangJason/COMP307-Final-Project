import deleteIcon from "../images/red_x.png";

import "../styles/TimeStamp.scss";

interface Props {
  start: string;
  end: string;
  onDelete: () => void;
}

const TimeStamp = ({ start, end, onDelete }: Props) => {
  return (
    <div className="timeStamp">
      {start} - {end}
      <img onClick={onDelete} src={deleteIcon} className="xIcon" />
    </div>
  );
};

export default TimeStamp;
