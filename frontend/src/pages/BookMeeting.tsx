import { useParams } from "react-router-dom";

const BookMeeting = () => {
  const { id } = useParams();

  return <>Book meeting {id}</>;
};

export default BookMeeting;
