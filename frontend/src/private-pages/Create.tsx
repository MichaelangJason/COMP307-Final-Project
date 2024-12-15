import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import CreateDate from "../components/CreateDate";
import CreateElements from "../components/CreateElements";
import "../styles/CreateSt.scss";
import CreateButton from "../components/CreateButton";
import Modal from "react-modal";

const Create = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [createMsg, msg] = useState<string>("");
  const [isPollRequired, ppoll] = useState<boolean>(false);
  const [timeoutInput, setTimeoutInput] = useState<string>("");

  const navigate = useNavigate();  

 
  const openModal = () => {
    msg("Are you sure that you want to create the meeting?");
    setIsModalOpen(true);
  };


  const closeModal = () => {
    setIsModalOpen(false);
  };

 
  const clickCreate = (event: React.FormEvent) => {
    event.preventDefault();
    openModal();
  };

  
  const previousPage = () => {
    navigate(-1);
  };

  return (
    <>
      <h1 style={{ marginBottom: "5px" }}>Create Meeting</h1>
      <form id="edit" onSubmit={clickCreate}>
        <CreateElements
        ppoll={ppoll}  
          setTimeoutInput={setTimeoutInput} 
        />
        <CreateDate />
        <CreateButton
          className="submitButton"
          value="Create"
          onSubmit={clickCreate}
        />
      </form>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Form"
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
            maxHeight: "215px",
            margin: "auto",
            padding: "20px",
          },
        }}
      >
        <p
          style={{
            fontFamily: "Helvetica, sans-serif",
            fontWeight: "500px",
            marginTop: "9px",
            fontSize: "18px",
          }}
        >
          {createMsg}
        </p>

        {/* extra info */}
        {isPollRequired ? (
          <p>This will create a poll that ends in {timeoutInput}</p>
        ) : (
          <p>This will be created directly without a poll.</p>
        )}

        <button
          onClick={closeModal}
          className="cancelButton"
          style={{
            marginRight: "185px",
            marginTop: "74px",
            backgroundColor: "#d9d9d9",
            borderRadius: "5px",
            fontFamily: '"Roboto", Helvetica, Arial, sans-serif',
            border: "none",
            color: "#ffffff",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          Cancel
        </button>

        <button
          onClick={previousPage}  
          className="createButton"
          style={{
            backgroundColor: "#ed1b2f",
            borderRadius: "5px",
            fontFamily: '"Roboto", Helvetica, Arial, sans-serif',
            border: "none",
            color: "#ffffff",
            fontWeight: "bold",
            padding: "10px 20px",
            marginLeft: "-25px",
          }}
        >
          Create
        </button>
      </Modal>
    </>
  );
};

export default Create;


