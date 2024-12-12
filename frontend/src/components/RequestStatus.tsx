import "../styles/RequestStatus.scss";

interface Props {
  status: "expired" | "pending" | "accepted";
}

const RequestStatus = ({ status }: Props) => {
  const getStatusInfo = () => {
    switch (status) {
      case "expired":
        return "Expired";
      case "pending":
        return "Pending";
      case "accepted":
        return "Accepted";
    }
  };

  return <div className={`requestStatus ${status}`}>{getStatusInfo()}</div>;
};

export default RequestStatus;
