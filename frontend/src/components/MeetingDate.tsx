import Calendar from "react-calendar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";

import { Meeting } from "@shared/types/db/meeting";
import "../styles/MeetingDate.scss";
import { useEffect, useState } from "react";
import TimeStamp from "./TimeStamp";
import SubmitButton from "./SubmitButton";
interface Props {
  availabilities: Meeting["availabilities"] | null;
  setAvailabilities: React.Dispatch<
    React.SetStateAction<Meeting["availabilities"] | null>
  >;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  meetingInfo: Meeting | null;
  readOnly?: boolean;
  token: string | null;
}

const predefinedTimeSlots: Array<string> = [];
for (let hour = 0; hour < 24; hour++) {
  for (let minute = 0; minute < 60; minute += 15) {
    const formattedHour = String(hour).padStart(2, "0");
    const formattedMinute = String(minute).padStart(2, "0");
    predefinedTimeSlots.push(`${formattedHour}:${formattedMinute}`);
  }
}

const MeetingDate = ({
  availabilities,
  setAvailabilities,
  selectedDate,
  setSelectedDate,
  meetingInfo,
  token,
  readOnly = false,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeToDelete, setTimeToDelete] = useState<string | null>(null);
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

    if (!selectedDate || readOnly) {
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
          ([key]) =>
            (timeToDelete !== null && key !== timeToDelete) ||
            (typeof time === "string" && key !== time)
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

    if (timeToDelete !== null) {
      const url = `${(window as any).backendURL}meeting/cancel/${meetingInfo?.meetingId}`;

      const formObject = {
        date: selectedDate.toLocaleDateString("en-CA"),
        slot: timeToDelete,
      };

      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formObject),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            const errorMessage = data.message || "Something went wrong";
            throw new Error(errorMessage);
          }
          return data;
        })
        .catch((err) => {
          console.error("Error occurred:", err.message);
          alert(`Error: ${err.message}`);
        });
    }
    setIsModalOpen(false);
    setTimeToDelete(null);
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

  const openDeleteModal = (time: string) => {
    setTimeToDelete(time);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setTimeToDelete(null);
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
          <input
            readOnly={readOnly}
            className={readOnly ? "grayInput textInput" : "textInput"}
            name="location"
            defaultValue={meetingInfo?.location}
            required
          />
        </div>
        <div className="startEndTime">
          <div className="timeSelectContainer">
            <label>Start Time</label>
            <select
              disabled={readOnly}
              className={readOnly ? "grayInput textInput" : "textInput"}
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
              disabled={readOnly}
              className={readOnly ? "grayInput textInput" : "textInput"}
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
            disabled={readOnly}
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
          {Object.entries(
            availabilities?.find(
              (data) => data.date === selectedDate.toLocaleDateString("en-CA")
            )?.slots ?? {}
          ).map(([slot, participants]) => (
            <TimeStamp
              key={slot}
              time={slot}
              onDelete={() =>
                participants.length > 0
                  ? openDeleteModal(slot)
                  : confirmDeleteTimeStamp(slot)
              }
              readOnly={readOnly}
            />
          ))}
        </div>
        <div className="participantsNumberInput">
          <label>Max Participants Number:</label>
          <input
            value={maxParticipants}
            type="text"
            readOnly={readOnly}
            className={readOnly ? "grayInput textInput" : "textInput"}
            onChange={handleParticipantsChange}
          />
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Confirm Delete"
        className="deleteModal"
        style={{
          overlay: {
            display: "flex",
            backgroundColor: "rgba(0, 0, 0, 0.78)",
            alignItems: "center",
            justifyContent: "center",
          },
          content: {
            textAlign: "center",
            maxWidth: "488px",
            margin: "auto",
            padding: "20px",
          },
        }}
      >
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this time slot?</p>
        <p>This will cancel the meeting for its participants.</p>
        <div className="modalButtons">
          <SubmitButton
            className="cancel"
            value="Cancel"
            onClick={closeDeleteModal}
          />
          <SubmitButton value="Delete" onClick={confirmDeleteTimeStamp} />
        </div>
      </Modal>
    </div>
  );
};

export default MeetingDate;
