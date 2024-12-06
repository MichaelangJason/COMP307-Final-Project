import express from "express";
import { Request } from "@shared/types/db";
import { RequestInfoRequest, RequestInfoResponse, RequestUpdateRequest, RequestUpdateResponse } from "./types.d";
import { getDocument } from "../utils/db";
import { CollectionNames } from "./constants";

const getInfo = async (req: RequestInfoRequest, res: RequestInfoResponse) => {
  // console.log(req);

  const requestId = req.params.requestId;
  const request = await getDocument<Request>(CollectionNames.REQUESTS_COLLECTION, requestId);


  if (!request) {
    res.status(404).json({ message: "Request not found" });
    return;
  }

  res.status(200).json(request);
}

const ping = async (req: express.Request, res: express.Response) => { 
  res.status(200).json({ message: "pong" });
}

const update = async (req: RequestUpdateRequest, res: RequestUpdateResponse) => {
  // const requestId = req.params.requestId;
  // const status = req.body;
  res.status(200).json({ message: "updated" });
}

export default { getInfo, ping, update };
