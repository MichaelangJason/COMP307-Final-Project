import { RequestInfoRequest, RequestInfoResponse } from "./types";
import { getCollection } from "utils";

const getInfo = async (req: RequestInfoRequest, res: RequestInfoResponse) => {
  const requestId = req.params.requestId;

  res.status(200).json({ message: "Hello World" });
}

export default { getInfo };
