import { useParams } from "react-router-dom";

const BookMeeting = () => {
  const { id } = useParams();

  return <h1>Book meeting {id}</h1>;
};

export default BookMeeting;
