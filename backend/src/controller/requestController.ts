import { Meeting, Request, User } from "@shared/types/db";
import {
  RequestCreateRequest,
  RequestCreateResponse,
  RequestInfoRequest,
  RequestInfoResponse,
  RequestUpdateRequest,
  RequestUpdateResponse,
} from "./types/request";
import {
  deleteDocument,
  getDocument,
  updateOneDocument,
} from "../utils/db";
import { CollectionNames } from "./constants";
import { ObjectId } from "mongodb";
import { RequestStatus } from "../utils/statusEnum";
import { getRequest, updateRequest, insertRequest } from "./utils/request";
import { getMeeting } from "./utils/meeting";

const getInfo = async (req: RequestInfoRequest, res: RequestInfoResponse) => {
  const requestId = req.params.requestId;
  let request: Request | null;

  if ((request = await getRequest(requestId)) === null) {
    res.status(404).json({ message: "Request not found" });
    return;
  }

  // if request proposed slot is in the past, set status to expired
  const startTime = request.proposedSlot.time.split("-")[0];
  if (
    new Date(request.proposedSlot.date + "T" + startTime + ":00") < new Date()
  ) {
    await updateRequest(request._id.toString(), RequestStatus.EXPIRED);
    request.status = RequestStatus.EXPIRED;
  }

  // only return fields in RequestInfo
  const { _id, createdAt, updatedAt, ...requestWithoutId } = request;
  res.status(200).json(requestWithoutId);
};

const update = async (
  req: RequestUpdateRequest,
  res: RequestUpdateResponse
) => {
  const requestId = req.params.requestId;
  const status = req.body.status;

  if (!requestId || status === undefined) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  let request: Request | null;

  if (!(request = await getRequest(requestId))) {
    res.status(404).json({ message: "Request not found" });
    return;
  }

  let meeting: Meeting | null;
  if (!(meeting = await getMeeting(request.meetingId))) {
    res.status(404).json({ message: "Meeting does not exist" });
    return;
  }

  if (meeting.hostId !== req.user.userId) {
    res.status(403).json({ message: "You are not authorized to update this request" });
    return;
  }

  if (!(await updateRequest(requestId, status))) {
    res.status(500).json({ message: "Failed to update request" });
    return;
  }

  res
    .status(200)
    .json({ message: "Request is now " + RequestStatus[status].toString() });
};

const create = async (
  req: RequestCreateRequest,
  res: RequestCreateResponse
) => {
  if (
    !req.body.proposerInfo ||
    !req.body.proposedSlot ||
    !req.body.reason ||
    !req.body.hostId
  ) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const { proposerInfo, proposedSlot, reason, hostId } = req.body;

  let host: User | null;
  // try {
  //   host = await getDocument<User>(CollectionNames.USER, new ObjectId(hostId));
  // } catch (error) {
  //   res.status(404).json({ message: "Host not found" });
  //   return;
  // }
  if (!(host = await getDocument<User>(CollectionNames.USER, new ObjectId(hostId)))) {
    res.status(404).json({ message: "Host not found" });
    return;
  }

  const date = new Date();
  const newRequest: Request = {
    _id: new ObjectId(),
    proposerInfo,
    proposedSlot,
    reason,
    status: RequestStatus.PENDING,
    createdAt: date,
    updatedAt: date,
  };

  if (!(await insertRequest(newRequest))) { 
    res.status(500).json({ message: "Failed to create request" });
    return;
  }

  try {
    await updateOneDocument<User>(CollectionNames.USER, new ObjectId(hostId), {
      $push: { requests: newRequest._id },
    } as any);
  } catch (error) {
    await deleteDocument<Request>(CollectionNames.REQUEST, newRequest._id); // rollback
    res.status(500).json({ message: "Failed to submit request" });
    return;
  }

  res.status(200).json({ message: "request submitted!" });
};

export default { getInfo, update, create };
