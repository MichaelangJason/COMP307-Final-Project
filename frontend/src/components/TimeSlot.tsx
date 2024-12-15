import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import "../styles/TimeSlot.scss";

interface Props {
  start: string;
  end: string;
  onDelete: () => void;
}

const TimeSlot = ({ start, end, onDelete }: Props) => {
  return (
    <div className="timeSlot">
      <span>{start} - {end}</span>
      <FontAwesomeIcon 
        icon={faTimesCircle} 
        className="fa-times-circle" 
        onClick={onDelete} 
      />
    </div>
  );
};

export default TimeSlot;
