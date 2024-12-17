import { ObjectId } from "../../../backend/node_modules/mongodb";
import { PollOption } from "../db/poll";

// common
export interface PollParams {
  pollId: string;
}

// get poll
export interface PollGetResponse {
  meetingId: ObjectId;
  pollId: ObjectId;
  options: PollOption[];
  results: number;
  timeout: Date;
}

// vote poll (update)
export interface PollVoteBody {
  date: string;
  slot: string;
}
