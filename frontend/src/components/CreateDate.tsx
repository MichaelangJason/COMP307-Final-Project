// Han Wen Fu

import { useEffect, useState } from "react";
import Calendar from "react-calendar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

import { Meeting } from "@shared/types/db/meeting";
import TimeStamp from "./TimeStamp";
import "../styles/MeetingDate.scss";

interface Props {
  availabilities: Meeting["availabilities"] | null;
  setAvailabilities: React.Dispatch<
    React.SetStateAction<Meeting["availabilities"] | null>
  >;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}

const predefinedTimeSlots: Array<string> = [];
for (let hour = 0; hour < 24; hour++) {
  for (let minute = 0; minute < 60; minute += 15) {
    const formattedHour = String(hour).padStart(2, "0");
    const formattedMinute = String(minute).padStart(2, "0");
    predefinedTimeSlots.push(`${formattedHour}:${formattedMinute}`);
  }
}

const CreateDate = ({
  availabilities,
  setAvailabilities,
  selectedDate,
  setSelectedDate,
}: Props) => {
  const [startTimeIndex, setStartTimeIndex] = useState<number>(0);
  const [endTimeIndex, setEndTimeIndex] = useState<number>(1);
  const [maxParticipants, setMaxParticipants] = useState<string>("");

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStartTimeIndex(Number(e.target.value));
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEndTimeIndex(Number(e.target.value));
  };

  const handleAddTimeStamp = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    time: string
  ) => {
    e.preventDefault();

    if (!selectedDate) {
      return;
    }

    const selectedAvailability = availabilities?.find(
      (a) => a.date === selectedDate.toLocaleDateString("en-CA")
    );

    if (selectedAvailability !== undefined) {
      const updatedSlots = { ...selectedAvailability.slots, [time]: [] };

      setAvailabilities((prevAvailabilities) =>
        (prevAvailabilities || []).map((availability) =>
          availability.date === selectedAvailability.date
            ? { ...availability, slots: updatedSlots }
            : availability
        )
      );
    } else {
      setAvailabilities((prevAvailabilities) => [
        ...(prevAvailabilities || []),
        {
          date: selectedDate.toLocaleDateString("en-CA"),
          slots: { [time]: [] },
          max: Number(maxParticipants),
        },
      ]);
    }
  };

  const confirmDeleteTimeStamp = async (time?: string) => {
    const selectedAvailability = availabilities?.find(
      (a) => a.date === selectedDate.toLocaleDateString("en-CA")
    );

    if (selectedAvailability !== undefined) {
      const updatedSlots = Object.fromEntries(
        Object.entries(selectedAvailability.slots).filter(
          ([key]) => key !== time
        )
      );

      if (Object.keys(updatedSlots).length === 0) {
        setAvailabilities((prevAvailabilities) =>
          (prevAvailabilities || []).filter(
            (availability) => availability.date !== selectedAvailability.date
          )
        );
      }

      setAvailabilities((prevAvailabilities) =>
        (prevAvailabilities || []).map((availability) =>
          availability.date === selectedAvailability.date
            ? { ...availability, slots: updatedSlots }
            : availability
        )
      );
    }
  };

  const handleParticipantsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    setMaxParticipants(val);

    if (val.trim() === "") return;

    let numericVal = parseInt(val, 10);

    if (isNaN(numericVal)) {
      return;
    }

    if (numericVal < 1) {
      setMaxParticipants("1");
      numericVal = 1;
      return;
    }

    if (!isNaN(numericVal)) {
      const selectedAvailability = availabilities?.find(
        (a) => a.date === selectedDate.toLocaleDateString("en-CA")
      );

      if (selectedAvailability) {
        setAvailabilities((prevAvailabilities) =>
          (prevAvailabilities || []).map((availability) =>
            availability.date === selectedAvailability.date
              ? { ...availability, max: numericVal }
              : availability
          )
        );
      }
    }
  };

  const isGreenDate = (date: Date) => {
    const formattedDate = date.toLocaleDateString("en-CA").split("T")[0];

    return availabilities
      ?.map((a) => a.date)
      .filter((date) => date !== selectedDate.toLocaleDateString("en-CA"))
      .includes(formattedDate);
  };

  useEffect(() => {
    const selectedAvailability = availabilities?.find(
      (data) => data.date === selectedDate.toLocaleDateString("en-CA")
    );
    if (selectedAvailability) {
      setMaxParticipants(selectedAvailability.max.toString());
    } else {
      setMaxParticipants("1");
    }
  }, [availabilities, selectedDate]);

  return (
    <div className="meetingDate roundShadowBorder">
      <div className="col1">
        <label>Select a Date</label>
        <Calendar
          value={selectedDate}
          calendarType="gregory"
          onChange={(value, _) => handleDateChange(value as Date)}
          tileClassName={({ date }) => (isGreenDate(date) ? "green-tile" : "")}
        />
      </div>
      <div className="col2">
        <div>
          <label>Location:</label>
          <input className="textInput" name="location" required />
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
                <option value={index}>{timeSlot}</option>
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
                  return <option value={index}>{timeSlot}</option>;
                } else {
                  return null;
                }
              })}
            </select>
          </div>
          <button
            className={selectedDate ? "icon" : "icon readOnly"}
            onClick={(e) =>
              handleAddTimeStamp(
                e,
                `${predefinedTimeSlots[startTimeIndex]}-${
                  predefinedTimeSlots[
                    Math.max(endTimeIndex, startTimeIndex + 1)
                  ]
                }`
              )
            }
          >
            <FontAwesomeIcon icon={faCirclePlus} />
          </button>
        </div>
        <div className="timeStampsContainer">
          {Object.keys(
            availabilities?.find(
              (data) => data.date === selectedDate.toLocaleDateString("en-CA")
            )?.slots ?? {}
          ).map((slot) => (
            <TimeStamp
              key={slot}
              time={slot}
              onDelete={() => confirmDeleteTimeStamp(slot)}
            />
          ))}
        </div>
        <div className="participantsNumberInput">
          <label>Max Participants Number:</label>
          <input
            value={maxParticipants}
            type="text"
            className="textInput"
            onChange={handleParticipantsChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateDate;
