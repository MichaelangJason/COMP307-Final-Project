// Han Wen Fu

import { RequestStatus } from "../../src/statusEnum";

import "../styles/RequestStatus.scss";

interface Props {
  status: RequestStatus;
}

const RequestStatusLabel = ({ status }: Props) => {
  const getStatusInfo = () => {
    switch (status) {
      case RequestStatus.EXPIRED:
        return "Expired";
      case RequestStatus.PENDING:
        return "Pending";
      case RequestStatus.DECLINED:
        return "Declined";
      case RequestStatus.ACCEPTED:
        return "Accepted";
    }
  };

  return <div className={`requestStatus ${getStatusInfo()}`}>{getStatusInfo()}</div>;
};

export default RequestStatusLabel;
