import MeetingCard from "../components/meetings/MeetingCard";

const Create = () => {
  return (
    <>
      <MeetingCard
        title="COMP 307 Office Hours"
        status="Closed"
        dateTime="2024-11-18, 15:30 - 18:00"
        location="MC24"
        person="Me"
      ></MeetingCard>
      <div></div>
    </>
  );
};

export default Create;
