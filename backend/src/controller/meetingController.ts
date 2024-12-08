import { ObjectId, UpdateFilter } from "mongodb";
import { MeetingCreateRequest, MeetingCreateResponse, MeetingRequest, MeetingResponse } from "./types/meeting";
import { deleteDocument, getDocument, insertDocument, updateOneDocument } from "../utils/db";
import { CollectionNames } from "./constants";
import { Meeting, MeetingAvailability, Poll, User } from "@shared/types/db";
import { MeetingInfo, PollInfo } from "@shared/types/api/meeting";
import { MeetingRepeat, MeetingStatus, dateRegex } from "../utils";


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

const isClosed = (meeting: Meeting) => {
  if (meeting.repeat.type === MeetingRepeat.WEEKLY) {
    // recurring meeting has ended
    return new Date() > new Date(`${meeting.repeat.endDate}T00:00:00`);
  } else {
    const lastAvailability = meeting.availabilities[meeting.availabilities.length - 1];
    const lastDate = new Date(`${lastAvailability.date}T23:59:59`); // end of day

    return lastDate < new Date();
  }
}

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const nextAvailability = (availability: MeetingAvailability, mult: number, endDate: string): MeetingAvailability | null => {
  const { date, slots } = availability;

  let nextDate = new Date(`${date}T00:00:00`);
  nextDate.setDate(nextDate.getDate() + mult * 7);

  // check if nextDate is still in the past
  if (nextDate < new Date()) {
    const dayOfWeek = nextDate.getDay(); // get day of week (0-6)
    nextDate = new Date();
    const daysUntilNext = (7 - (nextDate.getDay() - dayOfWeek)) % 7;

    nextDate.setDate(nextDate.getDate() + daysUntilNext);

    const latestStartTime = Object
      .keys(slots)
      .at(-1)!
      .split("-")[0]
      .split(":");

    // console.log(latestStartTime);

    nextDate.setHours(parseInt(latestStartTime[0]), parseInt(latestStartTime[1]), 0, 0);
    if (nextDate < new Date()) {
      nextDate.setDate(nextDate.getDate() + 7);
    }
  }

  if (nextDate > new Date(`${endDate}T00:00:00`)) return null; // recurring meeting has ended

  const nextDateString = formatDate(nextDate);

  const newAvailability = { ...availability, date: nextDateString };
  // for different time slots, clear participants
  for (const time in newAvailability.slots) {
    newAvailability.slots[time] = [];
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
    const availabilityDate = new Date(`${date}T23:59:59`); // end of day

    if (availabilityDate > today) continue;
    // already passed
    const newAvailability = nextAvailability(availability, 3, meeting.repeat.endDate);
    if (!newAvailability) break;
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
  }
  return newAvailabilities;
}

const isValidAvailabilities = (availabilities: MeetingAvailability[]) => {
  // Check for empty slots
  const emptySlots = availabilities.every((availability) => 
    Object.values(availability.slots).every((slots) => slots.length === 0)
  );

  // Check for duplicate dates
  const dates = availabilities.map(a => a.date);
  const uniqueDates = new Set(dates);
  const noDuplicates = dates.length === uniqueDates.size;

  // check if all dates are in the future
  const allFutureDates = availabilities.every((availability) => {
    const latestStartTime = Object.keys(availability.slots).at(-1)!.split("-")[0];
    return new Date(`${availability.date}T${latestStartTime}:00`) > new Date();
  });

  return emptySlots && noDuplicates && allFutureDates;
}

const createPollOptions = (availabilities: MeetingAvailability[]) => {
  return availabilities.map((availability) => ({
    date: availability.date,
    slots: Object.fromEntries(Object.entries(availability.slots).map(([time, _]) => [time, 0])),
  }));
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
  
  if (
    meeting.repeat.type === MeetingRepeat.WEEKLY && // recurring meeting
    meeting.updatedAt.toDateString() !== new Date().toDateString() // meeting hasn't been updated in a while
  ) {
    const newAvailabilities = await updateFutureAvailabilities(meeting);
    meeting.availabilities.push(...newAvailabilities);
    meeting.availabilities = meeting.availabilities.slice(newAvailabilities.length);
  }

  // does not check if meeting has ended/voting, only checks if it is upcoming
  if (meeting.status === MeetingStatus.UPCOMING && isClosed(meeting)) {
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
      timeout: formatDate(poll.timeout),
      results: poll.results,
    } : null,
  };

  res.status(200).json(meetingInfo);
};

const create = async (req: MeetingCreateRequest, res: MeetingCreateResponse) => {
  const { hostId } = req.params;
  const { title, description, location, availabilities, repeat, pollInfo } = req.body;

  if (
    !title ||
    !description ||
    !location ||
    !availabilities ||
    !availabilities.length ||
    !isValidAvailabilities(availabilities) ||
    !repeat
  ) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  if (pollInfo && (
    !pollInfo.timeout || !dateRegex.test(pollInfo.timeout) || new Date(pollInfo.timeout+"T23:59:59") < new Date() ||
    !pollInfo.results || typeof pollInfo.results !== "number"
  )) {
    res.status(400).json({ message: "Invalid poll info" });
    return;
  }

  // check if host exists
  try {
    await getDocument<User>(CollectionNames.USER, new ObjectId(hostId));
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Host not found" });
    return;
  }

  // create meeting
  let now = new Date();

  const newMeeting: Meeting = {
    _id: new ObjectId(),
    hostId: new ObjectId(hostId),
    title,
    description,
    location,
    availabilities,
    status: MeetingStatus.UPCOMING,
    repeat: repeat,
    createdAt: now,
    updatedAt: now,
  }

  // push future availabilities
  if (repeat.type === MeetingRepeat.WEEKLY) {
    const futureAvailabilities: MeetingAvailability[] = [];
    for (let i = 1; i < 4; i++) {
      availabilities.forEach((availability) => {
        const next = nextAvailability(availability, i, repeat.endDate);
        if (next) {
          futureAvailabilities.push(next);
        }
      });
    }
    newMeeting.availabilities.push(...futureAvailabilities);
    // sort availabilities by date
    newMeeting.availabilities.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  let pollId: ObjectId | null = null;
  if (pollInfo) {
    now = new Date();
    
    const newPoll: Poll = {
      _id: new ObjectId(),
      hostId: new ObjectId(hostId),
      meetingId: newMeeting._id,
      options: createPollOptions(availabilities),
      timeout: new Date(pollInfo.timeout+"T23:59:59"),
      results: pollInfo.results,
      createdAt: now,
      updatedAt: now,
    }

    newMeeting.pollId = newPoll._id;
    newMeeting.status = MeetingStatus.VOTING;

    try {
      pollId = await insertDocument<Poll>(CollectionNames.POLL, newPoll);
    } catch (error) {
      res.status(500).json({ message: "Failed to create poll" });
      return;
    }
  }

  if (!await insertMeeting(newMeeting)) {
    res.status(500).json({ message: "Failed to create meeting" });
    return;
  }

  if (!await updateOneDocument<User>(CollectionNames.USER, new ObjectId(hostId), { $push: { hostedMeetings: newMeeting._id } } as any)) {
    // rollback
    await deleteDocument<Meeting>(CollectionNames.MEETING, newMeeting._id);
    if (pollId) {
      await deleteDocument<Poll>(CollectionNames.POLL, pollId);
    }
    res.status(500).json({ message: "Failed to update host" });
    return;
  }

  res.status(200).json({ message: "Meeting created" });
};

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