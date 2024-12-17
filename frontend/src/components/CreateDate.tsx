import Calendar from "react-calendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import 'react-calendar/dist/Calendar.css'; // Import default calendar styles
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

  useEffect(() => {
    if (selectedDate) {
      const foundDateTimes = selectedDateTimes.find(dt => dt.date === selectedDate);
      if (foundDateTimes) {
        setSelectedTimes(foundDateTimes.times);
      } else {
        setSelectedTimes([]);
      }
    }
  }, [selectedDate, selectedDateTimes]);

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

  const handleAddTimeStamp = (
    e: React.MouseEvent<HTMLButtonElement>,
    newTimeIndices: [number, number]
  ) => {
    e.preventDefault();
  
    if (!selectedDate || newTimeIndices[0] >= newTimeIndices[1]) return;
  
    setSelectedDateTimes((prevDateTimes) => {
      const updatedDateTimes = prevDateTimes.map((dt) =>
        dt.date === selectedDate
          ? { ...dt, times: [...dt.times, newTimeIndices] }
          : dt
      );
  
      if (!updatedDateTimes.some((dt) => dt.date === selectedDate)) {
        updatedDateTimes.push({
          date: selectedDate,
          times: [newTimeIndices],
        });
      }
  
      return updatedDateTimes;
    });
  
    setSelectedTimes((prevTimes) => [...prevTimes, newTimeIndices]);
  };
  

  const handleDeleteTimeStamp = (index: number) => {
    setSelectedTimes((prevTimes) => {
      const updatedTimes = prevTimes.filter((_, i) => i !== index);
  
      setSelectedDateTimes((prevDateTimes) =>
        prevDateTimes
          .map((dt) =>
            dt.date === selectedDate
              ? { ...dt, times: dt.times.filter((_, i) => i !== index) }
              : dt
          )
          .filter((dt) => dt.times.length > 0)
      );
  
      return updatedTimes;
    });
  };
  

  const tileClassName = ({ date, view }: { date: Date, view: string }) => {
    if (view === 'month' && selectedDateTimes.some(dt => dt.date === date.toISOString().split("T")[0])) {
      return 'highlight';
    }
    return null;
  };

  return (
    <div className="meetingDate roundShadowBorder">
      <div className="col1">
        <label>Select a Date</label>
        <Calendar
          calendarType="gregory"
          onChange={(value, _) => handleDateChange(value as Date)}
          tileClassName={tileClassName}
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
              handleAddTimeStamp(e, [startTimeIndex, endTimeIndex])
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
              onDelete={() => handleDeleteTimeStamp(index)}
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


















