import Calendar from "react-calendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

import "../styles/MeetingDate.scss";
import { useState } from "react";
import TimeStamp from "./TimeStamp";

const predefinedTimeSlots: Array<string> = [];
for (let hour = 0; hour < 24; hour++) {
  for (let minute = 0; minute < 60; minute += 15) {
    const formattedHour = String(hour).padStart(2, "0");
    const formattedMinute = String(minute).padStart(2, "0");
    predefinedTimeSlots.push(`${formattedHour}:${formattedMinute}`);
  }
}

const MeetingDate = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [startTimeIndex, setStartTimeIndex] = useState<number>(0);
  const [endTimeIndex, setEndTimeIndex] = useState<number>(1);
  const [selectedTimes, setSelectedTimes] = useState<[number, number][]>([
    [1, 2],
    [15, 20],
  ]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStartTimeIndex(Number(e.target.value));
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEndTimeIndex(Number(e.target.value));
  };

  const handleAddTimeStamp = (newTimeIndices: [number, number]) => {
    if (!selectedDate) {
      return;
    }
    setSelectedTimes(prevTimes => [...prevTimes, newTimeIndices])
  };

  const handleDeleteTimeStamp = (index: number) => {
    setSelectedTimes(prevTimes => prevTimes.filter((_, i) => i != index) )
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
          <input className="grayInput textInput" name="location" />
        </div>
        <div className="startEndTime">
          <div className="timeSelectContainer">
            <label>Start Time</label>
            <select
              className="grayInput"
              value={startTimeIndex}
              onChange={handleStartTimeChange}
            >
              {predefinedTimeSlots.map((timeSlot, index) => (
                <option value={index}>{timeSlot}</option>
              ))}
            </select>
          </div>
          <div className="timeSelectContainer">
            <label>End Time</label>
            <select
              className="grayInput"
              value={endTimeIndex}
              onChange={handleEndTimeChange}
            >
              {predefinedTimeSlots.map((timeSlot, index) => {
                if (index > startTimeIndex) {
                  return <option value={index}>{timeSlot}</option>;
                } else {
                  return null;
                }
              })}
            </select>
          </div>
          <div
            className={selectedDate ? "icon" : "icon readOnly"}
            onClick={() => handleAddTimeStamp([startTimeIndex, endTimeIndex])}
          >
            <FontAwesomeIcon icon={faCirclePlus} />
          </div>
        </div>
        <div className="timeStampsContainer">
          {selectedTimes.map((timeIndices, index) => (
            <TimeStamp
              start={predefinedTimeSlots[timeIndices[0]]}
              end={predefinedTimeSlots[timeIndices[1]]}
              onDelete={() => handleDeleteTimeStamp(index)}
            />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label>Max Participants Number:</label>
          <input
            type="number"
            style={{ flexGrow: 1, textAlign: "center" }}
            className="grayInput textInput"
            name="participants"
          />
        </div>
      </div>
    </div>
  );
};

export default MeetingDate;
