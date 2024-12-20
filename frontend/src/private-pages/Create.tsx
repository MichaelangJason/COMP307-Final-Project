import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreateDate from "../components/CreateDate";
import CreateElements from "../components/CreateElements";
import "../styles/CreateSt.scss";
import Modal from "react-modal";
import { PollInfo } from "@shared/types/api/meeting";
import { Meeting } from "@shared/types/db/meeting";
import { MeetingRepeat } from "statusEnum";
import SubmitButton from "components/SubmitButton";

const Create: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const hostId = params.id;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPollRequired, setIsPollRequired] = useState<boolean>(false);
  const [timeoutInput, setTimeoutInput] = useState<PollInfo["timeout"]>("");
  const [availabilities, setAvailabilities] = useState<
    Meeting["availabilities"] | null
  >(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const token = sessionStorage.getItem("token");

  const [storedFormData, setStoredFormData] = useState<Record<string, any>>({});

  const handleSubmit = async () => {
    if (!availabilities || availabilities.length === 0) {
      setIsModalOpen(false);
      alert("No availabilities selected");
      return;
    }

    const url = `http://localhost:3007/meeting/${hostId}`;

    const formObject = { ...storedFormData };

    await fetch(url, {
      method: "POST",
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
      .then(() => {
        setIsModalOpen(false);
        navigate(`/user/${hostId}/manage`);
      })
      .catch((err) => {
        console.error("Error occurred:", err.message);
        setIsModalOpen(false);
        alert(`Error: ${err.message}`);
      });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const clickCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const formObject: Record<string, string> = {};
    const repeatKeys: Record<string, string | MeetingRepeat> = {};
    const pollInfoKeys: Record<string, string | number> = {};

    formData.forEach((value, key) => {
      if (key === "frequency") {
        repeatKeys["type"] = Number(value);
        return;
      }
      if (key === "end") {
        repeatKeys["endDate"] = value as string;
        return;
      }
      if (key === "rs") {
        if (isPollRequired) {
          pollInfoKeys["results"] = Number(value);
          return;
        } else {
          return;
        }
      } else if (key === "tm") {
        if (isPollRequired) {
          pollInfoKeys["timeout"] = value as string;
          return;
        } else {
          return;
        }
      }
      formObject[key] = value as string;
    });

    if (repeatKeys["type"] === 0) {
      delete repeatKeys["endDate"];
    }

    const finalData = isPollRequired
      ? {
          ...formObject,
          repeat: repeatKeys,
          pollInfo: pollInfoKeys,
          availabilities,
        }
      : {
          ...formObject,
          repeat: repeatKeys,
          availabilities,
        };

    console.log(finalData, availabilities);

    setStoredFormData(finalData);
    openModal();
  };

  return (
    <>
      <h1 style={{ marginBottom: "5px" }}>Create Meeting</h1>
      <form id="edit-create" onSubmit={clickCreate}>
        <CreateElements
          isPollRequired={isPollRequired}
          setIsPollRequired={setIsPollRequired}
          setTimeoutInput={setTimeoutInput}
        />
        <CreateDate
          availabilities={availabilities}
          setAvailabilities={setAvailabilities}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <div className="buttons">
          <SubmitButton value="Create" className="submitButton" />
        </div>
      </form>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
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
        <h2>Confirm Creation</h2>
        {isPollRequired ? (
          <p>This will create a poll that ends in {timeoutInput}.</p>
        ) : (
          <p>This will be created directly without a poll.</p>
        )}
        <div className="modalButtons">
          <SubmitButton
            className="cancel"
            value="Cancel"
            onClick={closeModal}
          />
          <SubmitButton value="Create" onClick={handleSubmit} />
        </div>
      </Modal>
    </>
  );
};

export default Create;
