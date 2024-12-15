import Calendar from "react-calendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import "../styles/CreateDates.scss";
import { useState, useEffect } from "react";
import TimeSlot from "./TimeSlot";

const predefinedTimeSlots: Array<string> = [];
for (let hour = 0; hour < 24; hour++) {
  for (let minute = 0; minute < 60; minute += 15) {
    const formattedHour = String(hour).padStart(2, "0");
    const formattedMinute = String(minute).padStart(2, "0");
    predefinedTimeSlots.push(`${formattedHour}:${formattedMinute}`);
  }
}

const CreateDate = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [startTimeIndex, setStartTimeIndex] = useState<number>(0);
  const [endTimeIndex, setEndTimeIndex] = useState<number>(1);
  const [selectedTimes, setSelectedTimes] = useState<[number, number][]>([]);
  const [selectedDateTimes, setSelectedDateTimes] = useState<
    {
      date: string;
      times: [number, number][];
    }[]
  >([]);

  useEffect(() => {
    if (endTimeIndex <= startTimeIndex) {
      setEndTimeIndex(startTimeIndex + 1);
    }
  }, [startTimeIndex]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStartTimeIndex = Number(e.target.value);
    setStartTimeIndex(newStartTimeIndex);

    if (endTimeIndex <= newStartTimeIndex) {
      setEndTimeIndex(newStartTimeIndex + 1);
    }
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEndTimeIndex(Number(e.target.value));
  };

  const handleAddTimeSlot = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    newTimeIndices: [number, number]
  ) => {
    e.preventDefault();

    if (!selectedDate || newTimeIndices[0] >= newTimeIndices[1]) {
      return;
    }
    setSelectedTimes((prevTimes) => [...prevTimes, newTimeIndices]);
  };

  const handleDeleteTimeSlot = (index: number) => {
    setSelectedTimes((prevTimes) => prevTimes.filter((_, i) => i !== index));
  };

  return (
    <div className="meetingDate roundShadowBorder">
      <div className="col1">
        <label>Select a Date</label>
        <Calendar
          calendarType="gregory"
          onChange={(value, _) => handleDateChange(value as Date)}
        />
      </div>
      <div className="col2">
        <div>
          <label>Location:</label>
          <input
            className="textInput"
            type="text"
            name="location"
          />
        </div>
        <div className="startEndTime">
          <div className="timeSelectContainer">
            <label>Start Time</label>
            <select
              className="textInput"
              value={startTimeIndex}
              onChange={handleStartTimeChange}
            >
              {predefinedTimeSlots.map((timeSlot, index) => (
                <option key={index} value={index}>{timeSlot}</option>
              ))}
            </select>
          </div>
          <div className="timeSelectContainer">
            <label>End Time</label>
            <select
              className="textInput"
              value={endTimeIndex}
              onChange={handleEndTimeChange}
            >
              {predefinedTimeSlots.map((timeSlot, index) => {
                if (index > startTimeIndex) {
                  return <option key={index} value={index}>{timeSlot}</option>;
                } else {
                  return null;
                }
              })}
            </select>
          </div>
          <button
            className={selectedDate ? "icon" : "icon readOnly"}
            onClick={(e) =>
              handleAddTimeSlot(e, [startTimeIndex, endTimeIndex])
            }
          >
            <FontAwesomeIcon icon={faCirclePlus} />
          </button>
        </div>
        <div className="timeSlotsContainer">
          {selectedTimes.map((timeIndices, index) => (
            <TimeSlot
              key={index}
              start={predefinedTimeSlots[timeIndices[0]]}
              end={predefinedTimeSlots[timeIndices[1]]}
              onDelete={() => handleDeleteTimeSlot(index)}
            />
          ))}
        </div>
        <div className="participantsNumber">
          <label>Max Participants Number per Time Slot:</label>
          <input
            type="number"
            min={0}
            className="textInput"
            name="participants"
          />
        </div>
      </div>
    </div>
  );
};

export default CreateDate;








