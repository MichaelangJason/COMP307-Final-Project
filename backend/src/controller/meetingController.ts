import { ObjectId, UpdateFilter } from "mongodb";
import { MeetingRequest, MeetingResponse } from "./types/meeting";
import { getDocument, insertDocument, updateOneDocument } from "../utils/db";
import { CollectionNames } from "./constants";
import { Meeting, MeetingAvailability, Poll } from "@shared/types/db";
import { MeetingInfo, PollInfo } from "@shared/types/api/meeting";
import { MeetingRepeat, MeetingStatus } from "../utils";

const getMeeting = async (meetingId: string): Promise<Meeting | null> => {
  try {
    return await getDocument<Meeting>(CollectionNames.MEETING, new ObjectId(meetingId));
  } catch (error) {
    console.error(error);
    return null;
  }
};

const insertMeeting = async (meeting: Meeting): Promise<ObjectId | null> => {
  try {
    return await insertDocument<Meeting>(CollectionNames.MEETING, meeting);
  } catch (error) {
    console.error(error);
    return null;
  }
};

const updateMeeting = async (meetingId: string, update: UpdateFilter<Meeting>): Promise<boolean> => {
  try {
    return await updateOneDocument<Meeting>(CollectionNames.MEETING, new ObjectId(meetingId), update);
  } catch (error) {
    console.error(error);
    return false;
  }
}

const isExpired = (meeting: Meeting) => {
  if (meeting.status !== MeetingStatus.UPCOMING) return false;
  if (meeting.repeat.type === MeetingRepeat.ONCE) {
    const lastAvailability = meeting.availabilities[meeting.availabilities.length - 1];
    const lastDate = new Date(lastAvailability.date);
    lastDate.setHours(23, 59, 59, 999); // set to end of day

    return lastDate < new Date();
  }
  return false; // recurring meeting does not expire until set to ONCE
}

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const nextAvailability = (availability: MeetingAvailability, mult: number) => {
  const nextDate = new Date(availability.date);
  nextDate.setDate(nextDate.getDate() + mult * 7);
  const nextDateString = formatDate(nextDate);

  const newAvailability = { ...availability, date: nextDateString };
  // for different time slots, clear participants
  for (const timeSlot in availability.slots) {
    newAvailability.slots[timeSlot] = [];
  }

  return newAvailability;
}

const updateFutureAvailabilities = async (meeting: Meeting) => {
  const { _id: meetingId, availabilities } = meeting;
  const today = new Date();
  let newAvailabilities: MeetingAvailability[] = [];
  
  // the availabilities are in time order
  for (const availability of availabilities) {
    const { date } = availability;
    const availabilityDate = new Date(date);
    availabilityDate.setHours(23, 59, 59, 999); // set to end of day

    if (availabilityDate > today) continue;
    // already passed
    const newAvailability = nextAvailability(availability, 3);
    newAvailabilities.push(newAvailability);
  }

  // remove first len(newAvailabilities) availabilities
  const popSize = newAvailabilities.length;
  // console.log(popSize);
  if (popSize > 0) {
    await updateMeeting(meetingId.toString(), {
      $push: { 
        availabilities: 
        { 
          $each: newAvailabilities,
          $slice: -availabilities.length // the array length unchanged, keep the last availabilities
        } 
      },
      $set: { updatedAt: new Date() }
    } as any);

    // await updateMeeting(meetingId.toString(), { $set: { updatedAt: new Date() } });
  }
  return newAvailabilities;
}

const getInfo = async (req: MeetingRequest, res: MeetingResponse) => {
  const { meetingId } = req.params;
  let meeting: Meeting | null;

  if (!(meeting = await getMeeting(meetingId))) {
    res.status(404).json({ message: "Meeting not found" });
    return;
  }

  let poll: Poll | null = null;
  if (meeting.pollId) {
    console.log(meeting.pollId);
    try {
      poll = await getDocument<Poll>(CollectionNames.POLL, new ObjectId(meeting.pollId));
    } catch (error) {
      console.log("error getting poll: ", meeting.pollId);
      console.error(error);
    }
  }
  
  // update future availabilities if meeting hasn't been updated in a while
  if (meeting.updatedAt < new Date()) {
    const newAvailabilities = await updateFutureAvailabilities(meeting);
    meeting.availabilities.push(...newAvailabilities);
    meeting.availabilities = meeting.availabilities.slice(newAvailabilities.length);
  }

  if (isExpired(meeting)) {
    meeting.status = MeetingStatus.CLOSED;
    await updateMeeting(meeting._id.toString(), { $set: { status: meeting.status, updatedAt: new Date() } });
  }

  // parse meeting to meeting info
  const meetingInfo: MeetingInfo = {
    meetingId: meeting._id.toString(),
    title: meeting.title,
    description: meeting.description,
    location: meeting.location,
    availabilities: meeting.availabilities,
    status: meeting.status,
    pollInfo: poll ? {
      options: poll.options,
      timeout: poll.timeout,
      results: poll.results,
    } : null,
  };

  res.status(200).json(meetingInfo);
};

const create = async () => {};

const update = async () => {};

const book = async () => {};

const unbook = async() => {};

export default {
  getInfo,
  create,
  update,
  book,
  unbook
};