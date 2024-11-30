import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import "../styles/BookMeeting.scss";
import SubmitButton from "components/SubmitButton";

const predefinedTimeSlots: Array<string> = [];
for (let hour = 0; hour < 24; hour++) {
  for (let minute = 0; minute < 60; minute += 15) {
    const formattedHour = String(hour).padStart(2, "0");
    const formattedMinute = String(minute).padStart(2, "0");
    predefinedTimeSlots.push(`${formattedHour}:${formattedMinute}`);
  }
}

const BookMeeting = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [startTimeIndex, setStartTimeIndex] = useState<number>(0);
  const [endTimeIndex, setEndTimeIndex] = useState<number>(1);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStartTimeIndex(Number(e.target.value));
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEndTimeIndex(Number(e.target.value));
  };

  return (
    <div id="bookMeeting">
      <div className="bookContent">
        <h1>Booking for COMP307 - office hour</h1>
        <div className="formContainer">
          <div className="calendarForm">
            <Calendar
              calendarType="gregory"
              onChange={(value, _) => handleDateChange(value as Date)}
            />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Select a time slot:</label>
                <select>
                  {["14:30-14:45"].map((timeSlot, index) => (
                    <option value={index}>{timeSlot}</option>
                  ))}
                </select>
              </div>
              <div className="startEndTime">
                <div className="timeSelectContainer">
                  <label>Start Time</label>
                  <select
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
                  <select value={endTimeIndex} onChange={handleEndTimeChange}>
                    {predefinedTimeSlots.map((timeSlot, index) => {
                      if (index > startTimeIndex) {
                        return <option value={index}>{timeSlot}</option>;
                      } else {
                        return null;
                      }
                    })}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <form className="bookingForm">
            <h1>Booking Form</h1>
            <label>Last Name:</label>
            <input type="text" name="lname" required />
            <label>First Name:</label>
            <input type="text" name="fname" required />
            <label>Email:</label>
            <input type="email" name="email" required />
            <div className="requestAlt">
              <label>Request an alternative time:</label>
              <input
                style={{ margin: "0", width: "70px", height: "30px" }}
                type="checkbox"
                name="isRequest"
              />
            </div>
            <label style={{ opacity: "20%" }}>Reason of meeting:</label>
            <input
              style={{ opacity: "20%", flexGrow: "1" }}
              readOnly
              type="text"
              name="reason"
            />
            <SubmitButton
              className="submitButton"
              value="Submit"
              onSubmit={() => console.log("submit")}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookMeeting;
