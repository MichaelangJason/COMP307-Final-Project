import express from "express";
import { Request, User } from "@shared/types/db";
import { RequestCreateRequest, RequestCreateResponse, RequestInfoRequest, RequestInfoResponse, RequestUpdateRequest, RequestUpdateResponse } from "./types.d";
import { deleteDocument, getDocument, insertDocument, updateOneDocument } from "../utils/db";
import { CollectionNames } from "./constants";
import { ObjectId } from "mongodb";
import { RequestStatus } from "../utils";

const getRequest = async (requestId: string): Promise<Request | null> => {
  try {
    const document = await getDocument<Request>(CollectionNames.REQUEST, new ObjectId(requestId));
    return document;
  } catch (error) {
    return null;
  }
}

const updateRequest = async (requestId: string, status: RequestStatus): Promise<boolean> => {
  try {
    await updateOneDocument<Request>(CollectionNames.REQUEST, new ObjectId(requestId), { $set: { status } } as any);
    return true;
  } catch (error) {
    return false;
  }
}

const getInfo = async (req: RequestInfoRequest, res: RequestInfoResponse) => {
  const requestId = req.params.requestId;
  let request: Request | null;

  if ((request = await getRequest(requestId)) === null) {
    res.status(404).json({ message: "Request not found" });
    return;
  }

  // if request proposed slot is in the past, set status to expired
  const startTime = request.proposedSlot.time.split("-")[0];
  if (new Date(request.proposedSlot.date + "T" + startTime + ":00") < new Date()) {
    // console.log("request expired");
    await updateOneDocument<Request>(CollectionNames.REQUEST, request._id, { $set: { status: RequestStatus.EXPIRED } } );
    request.status = RequestStatus.EXPIRED;
  }

  // only return fields in RequestInfo
  const { _id, createdAt, updatedAt, ...requestWithoutId } = request;
  res.status(200).json(requestWithoutId);
}

const ping = async (req: express.Request, res: express.Response) => { 
  res.status(200).json({ message: "pong" });
}

const update = async (req: RequestUpdateRequest, res: RequestUpdateResponse) => {
  const requestId = req.params.requestId;
  const status = req.body.status;

  if (!requestId || status === undefined) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  let request: Request | null;

  if ((request = await getRequest(requestId)) === null) {
    res.status(404).json({ message: "Request not found" });
    return;
  } 

  if (!await updateRequest(requestId, status)) {
    res.status(500).json({ message: "Failed to update request" });
    return;
  }

  res.status(200).json({ message: "Request is now " + RequestStatus[status].toString() });
}

const create = async (req: RequestCreateRequest, res: RequestCreateResponse) => {

  if (!req.body.proposerInfo || !req.body.proposedSlot || !req.body.reason || !req.body.hostId) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const { proposerInfo, proposedSlot, reason, hostId } = req.body;

  let host: User;
  try {
    host = await getDocument<User>(CollectionNames.USER, new ObjectId(hostId));
  } catch (error) {
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
  }

  let resultId: ObjectId;
  try {
    resultId = await insertDocument<Request>(CollectionNames.REQUEST, newRequest);
  } catch (error) {
    res.status(500).json({ message: "Failed to create request" });
    return;
  }

  if (resultId.toString() !== newRequest._id.toString()) {
    await deleteDocument<Request>(CollectionNames.REQUEST, newRequest._id); // rollback
    res.status(500).json({ message: "Failed to create request" });
    return;
  }

  try {
    await updateOneDocument<User>(CollectionNames.USER, new ObjectId(hostId), { $push: { requests: newRequest._id } } as any);
  } catch (error) {
    await deleteDocument<Request>(CollectionNames.REQUEST, newRequest._id); // rollback
    res.status(500).json({ message: "Failed to submit request" });
    return;
  }

  res.status(200).json({ message: "request submitted!" });
}


export default { getInfo, ping, update, create };
