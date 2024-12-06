import { Request } from "@shared/types/db";
import { RequestInfoRequest, RequestInfoResponse } from "./types";
import { getDocument } from "utils";
import { CollectionNames } from "./constants";

const getInfo = async (req: RequestInfoRequest, res: RequestInfoResponse) => {
  const requestId = req.params.requestId;
  const request = await getDocument<Request>(CollectionNames.REQUESTS_COLLECTION, requestId);

  if (!request) {
    res.status(404).json({ message: "Request not found" });
    return;
  }

  res.status(200).json(request);
}

export default { getInfo };
