import { CollectionNames } from "../constants";
import { ObjectId } from "mongodb";
import { getDocument, insertDocument, updateOneDocument } from "../../utils/db";
import { RequestStatus } from "../../utils/statusEnum";
import { Request } from "@shared/types/db";

export const getRequest = async (requestId: string): Promise<Request | null> => {
  try {
    const document = await getDocument<Request>(
      CollectionNames.REQUEST,
      new ObjectId(requestId)
    );
    return document;
  } catch (error) {
    return null;
  }
};

export const updateRequest = async (
  requestId: string,
  status: RequestStatus
): Promise<boolean> => {
  try {
    await updateOneDocument<Request>(
      CollectionNames.REQUEST,
      new ObjectId(requestId),
      { $set: { status } } as any
    );
    return true;
  } catch (error) {
    return false;
  }
};

export const insertRequest = async (document: Request): Promise<ObjectId | null> => {
  try {
    return await insertDocument<Request>(CollectionNames.REQUEST, document);
  } catch (error) {
    return null;
  }
}

export const updateIfExpired = async (request: Request) => {
  const startTime = request.proposedSlot.time.split("-")[0];
  if (
    new Date(request.proposedSlot.date + "T" + startTime + ":00") < new Date()
  ) {
    await updateRequest(request._id.toString(), RequestStatus.EXPIRED);
    request.status = RequestStatus.EXPIRED;
  }
}