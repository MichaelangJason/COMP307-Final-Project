import bin_icon from "../images/bin.png";
import clock_icon from "../images/clock.png";
import location_icon from "../images/location.png";
import person_icon from "../images/person.png";
import edit_icon from "../images/edit.png";
import clipboard_icon from "../images/clipboard.png";
import "../styles/MeetingCard.scss";

interface Props {
  title: string;
  status: string;
  dateTime: string; //Expected format: 2024-11-18, 15:30 - 18:00
  location: string;
  person: string;
  canEdit?: boolean;
  onDelete?: () => void; //Callback fct
  onCopy?: () => void;
}

const MeetingCard = ({
  title,
  status,
  dateTime,
  location,
  person,
  canEdit = false,
  onDelete,
  onCopy,
}: Props) => {
  return (
    <div className="meetingCard">
      <div className="card-title">
        <h2>{title}</h2>
        <div className="card-actions">
          {canEdit ? (
            <>
              <button
                onClick={onCopy}
                className="action-button"
                title="Copy booking link"
              >
                <img src={clipboard_icon} alt="Copy booking link" />
              </button>
              <button
                onClick={onDelete}
                className="action-button"
                title="Edit meeting"
              >
                <img src={edit_icon} alt="Edit Meeting" />
              </button>
            </>
          ) : (
            <button onClick={onDelete} className="action-button">
              <img src={bin_icon} alt="Delete" />
            </button>
          )}
        </div>
      </div>

      <div className={`card-status ${status}`}>{status}</div>

      <div className="card-description">
        <div className="card-info">
          <img src={clock_icon} alt="Clock Icon" />
          {dateTime}
        </div>
        <div className="card-info">
          <img src={location_icon} alt="Location Icon" />
          {location}
        </div>
        <div className="card-info">
          <img src={person_icon} alt="Person Icon" />
          {person}
        </div>
      </div>
    </div>
  );
};

export default MeetingCard;
