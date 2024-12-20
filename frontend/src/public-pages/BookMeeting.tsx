import { useCallback, useEffect, useState } from "react";
import Calendar from "react-calendar";
import { useParams } from "react-router-dom";

import "react-calendar/dist/Calendar.css";

import { MeetingAvailability } from "../../../shared/types/db/meeting";
import { VerifyResponse } from "../../../shared/types/api/auth";
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
  const params = useParams();
  const id = params.id;

  const [availabilities, setAvailabilities] = useState<MeetingAvailability[]>(
    []
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slot, setSlot] = useState<string | null>(null);
  const [startTimeIndex, setStartTimeIndex] = useState<number>(0);
  const [endTimeIndex, setEndTimeIndex] = useState<number>(1);
  const [isRequestAlt, setIsRequestAlt] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<VerifyResponse | null>(null);
  const [hostId, setHostId] = useState<VerifyResponse | null>(null);
  const [meetingTitle, setMeetingTitle] = useState<string>("");

  const token = sessionStorage.getItem("token");

  const fetchUserInfo = useCallback(async () => {
    const url = `http://localhost:3007/login`;

    await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          const errorMessage = data.message || "Something went wrong";
          throw new Error(errorMessage);
        }
        return data;
      })
      .then((data) => {
        setUserInfo(data);
      })
      .catch((err) => {
        console.error("Error occurred:", err.message);
      });
  }, [token]);

  const fetchMeetinInfo = useCallback(async () => {
    const url = `http://localhost:3007/meeting/${id}`;

    await fetch(url, {
      method: "GET",
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          const errorMessage = data.message || "Something went wrong";
          throw new Error(errorMessage);
        }
        return data;
      })
      .then((data) => {
        setHostId(data.hostId);
        setAvailabilities(data.availabilities);
        setMeetingTitle(data.title);
      })
      .catch((err) => {
        console.error("Error occurred:", err.message);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!slot && !isRequestAlt) {
      alert("Select a valid date");
      return;
    }

    const formData = new FormData(e.currentTarget);

    const formObject: Record<string, string> = {};
    const participantKeys = ["firstName", "lastName", "email"];

    if (isRequestAlt) {
      const proposerInfo: Record<string, string> = {};

      formData.forEach((value, key) => {
        if (participantKeys.includes(key)) {
          proposerInfo[key] = value as string;
        } else {
          formObject[key] = value as string;
        }
      });

      const finalData = {
        ...formObject,
        hostId,
        proposerInfo,
        proposedSlot: {
          date: selectedDate.toLocaleDateString("en-CA"),
          time: `${predefinedTimeSlots[startTimeIndex]}-${predefinedTimeSlots[endTimeIndex]}`,
        },
      };

      const url = `http://localhost:3007/request/${hostId}`;

      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            const errorMessage = data.message || "Something went wrong";
            throw new Error(errorMessage);
          }
          return data;
        })
        .then(() => {
          alert("Submitted!");
        })
        .catch((err) => {
          console.error("Error occurred:", err.message);
          alert(`Error: ${err.message}`);
        });
    } else {
      const participantInfo: Record<string, string> = {};

      formData.forEach((value, key) => {
        if (participantKeys.includes(key)) {
          participantInfo[key] = value as string;
        } else if (key === "reason") {
          return;
        } else {
          formObject[key] = value as string;
        }
      });

      const finalData = {
        ...formObject,
        participantInfo,
        slot,
        date: selectedDate.toLocaleDateString("en-CA"),
      };

      const url = `http://localhost:3007/meeting/book/${id}`;

      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            const errorMessage = data.message || "Something went wrong";
            throw new Error(errorMessage);
          }
          return data;
        })
        .then(() => {
          alert("Submitted!");
        })
        .catch((err) => {
          console.error("Error occurred:", err.message);
          alert(`Error: ${err.message}`);
        });
    }
  };

  const handleDateChange = (date: Date) => {
    const slotsAtDate = Object.keys(getSlotsAtDate(date));

    setSelectedDate(date);
    if (slotsAtDate.length === 0) {
      setSlot(null);
    } else {
      setSlot(slotsAtDate[0]);
    }
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStartTimeIndex(Number(e.target.value));
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEndTimeIndex(Number(e.target.value));
  };

  const isGreenDate = (date: Date) => {
    const formattedDate = date.toLocaleDateString("en-CA").split("T")[0];

    return availabilities
      ?.map((a) => a.date)
      .filter((date) => date !== selectedDate.toLocaleDateString("en-CA"))
      .includes(formattedDate);
  };

  const getSlotsAtDate = (date: Date) => {
    const stringDate = date.toLocaleDateString("en-CA");

    return (
      availabilities?.find((a: MeetingAvailability) => a.date === stringDate)
        ?.slots ?? {}
    );
  };

  useEffect(() => {
    fetchUserInfo();
    fetchMeetinInfo();
  }, [fetchMeetinInfo, fetchUserInfo]);

  return (
    <div id="bookMeeting">
      <div className="bookContent">
        <h1>Booking for {meetingTitle}</h1>
        <div className="formContainer">
          <div className="calendarForm">
            <Calendar
              value={selectedDate}
              calendarType="gregory"
              onChange={(value, _) => handleDateChange(value as Date)}
              tileClassName={({ date }) =>
                isGreenDate(date) ? "green-tile" : ""
              }
            />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div
                className={isRequestAlt ? "readOnly" : ""}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label>Select a time slot:</label>
                <select
                  required
                  disabled={
                    isRequestAlt ||
                    Object.keys(getSlotsAtDate(selectedDate)).length === 0
                  }
                  onChange={(e) => setSlot(e.currentTarget.value)}
                  value={
                    slot ||
                    Object.keys(getSlotsAtDate(selectedDate))[0] ||
                    "No options available"
                  }
                >
                  {Object.keys(getSlotsAtDate(selectedDate)).map((timeSlot) => (
                    <option value={timeSlot}>{timeSlot}</option>
                  ))}
                  {Object.keys(getSlotsAtDate(selectedDate)).length === 0 && (
                    <option>No options available</option>
                  )}
                </select>
              </div>
              <div
                className={
                  isRequestAlt ? "startEndTime" : "startEndTime readOnly"
                }
              >
                <div className="timeSelectContainer">
                  <label>Start Time</label>
                  <select
                    disabled={!isRequestAlt}
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
                    disabled={!isRequestAlt}
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
              </div>
            </div>
          </div>
          <form
            className="bookingForm roundShadowBorder"
            onSubmit={handleSubmit}
          >
            <h1>Booking Form</h1>
            <label>Last Name:</label>
            <input
              className={`textInput ${userInfo ? "grayInput" : ""}`}
              readOnly={userInfo !== null}
              type="text"
              name="lastName"
              required
              defaultValue={userInfo?.lastName || ""}
            />
            <label>First Name:</label>
            <input
              className={`textInput ${userInfo ? "grayInput" : ""}`}
              readOnly={userInfo !== null}
              type="text"
              name="firstName"
              required
              defaultValue={userInfo?.firstName || ""}
            />
            <label>Email:</label>
            <input
              className={`textInput ${userInfo ? "grayInput" : ""}`}
              readOnly={userInfo !== null}
              type="email"
              name="email"
              required
              defaultValue={userInfo?.email || ""}
            />
            <div className="requestAlt">
              <label>Request an alternative time:</label>
              <input
                className="textInput"
                style={{ margin: "0", width: "25px", height: "25px" }}
                type="checkbox"
                onClick={() => setIsRequestAlt(!isRequestAlt)}
              />
            </div>
            <label className={isRequestAlt ? "" : "readOnly"}>
              Reason of meeting:
            </label>
            <textarea
              required
              className={isRequestAlt ? "textInput" : "readOnly textInput"}
              readOnly={!isRequestAlt}
              name="reason"
            />
            <SubmitButton className="submitButton" value="Submit" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookMeeting;
