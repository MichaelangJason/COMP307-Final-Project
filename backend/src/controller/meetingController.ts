import { ObjectId, UpdateFilter } from "mongodb";
import {
  MeetingBookRequest,
  MeetingBookResponse,
  MeetingCancelRequest,
  MeetingCancelResponse,
  MeetingCreateRequest,
  MeetingCreateResponse,
  MeetingRequest,
  MeetingResponse,
  MeetingUnbookRequest,
  MeetingUnbookResponse,
  MeetingUpdateRequest,
  MeetingUpdateResponse,
} from "./types/meeting";
import { deleteDocument, getCollection, getDocument, insertDocument, updateOneDocument } from "../utils/db";
import { CollectionNames } from "./constants";
import { Meeting, MeetingAvailability, Participant, Poll, UpcomingMeeting, User } from "@shared/types/db";
import { MeetingInfo } from "@shared/types/api/meeting";
import { MeetingRepeat, MeetingStatus, dateRegex } from "../utils";
import { getMeeting, formatDate, isValidAvailabilities, insertMeeting, updateMeeting, isClosed, isValidUserId, nextAvailability, updateFutureAvailabilities, createPollOptions } from "./utils/meeting";
import { isAllowed } from "./utils/user";

const getInfo = async (req: MeetingRequest, res: MeetingResponse) => {
  const { meetingId } = req.params;

  const meeting: Meeting | null = await getMeeting(meetingId);
  if (!meeting) {
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

  let host: User | null = null;
  if (!(host = await getDocument<User>(CollectionNames.USER, meeting.hostId))) {
    res.status(404).json({ message: "Host not found" });
    return;
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
    hostId: host._id.toString(),
    hostFirstName: host.firstName,
    hostLastName: host.lastName,
  };

  res.status(200).json(meetingInfo);
};

const create = async (req: MeetingCreateRequest, res: MeetingCreateResponse) => {
  const { hostId } = req.params;
  const { title, description, location, availabilities, repeat, pollInfo } = req.body;

  if (!isAllowed(req.user.role, hostId, req.user.userId)) {
    res.status(403).json({ message: "You are not authorized to create a meeting" });
    return;
  }

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
    !pollInfo.results || typeof pollInfo.results !== "number" || !isValidUserId(hostId)
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

// update info
const update = async (req: MeetingUpdateRequest, res: MeetingUpdateResponse) => {
  const { meetingId } = req.params;
  
  let meeting: Meeting | null = await getMeeting(meetingId);
  if (!meeting) {
    res.status(404).json({ message: "Meeting not found" });
    return;
  }

  if (!isAllowed(req.user.role, meeting.hostId.toString(), req.user.userId)) {
    res.status(403).json({ message: "You are not authorized to update this meeting" });
    return;
  }
  
  const update: UpdateFilter<Meeting> = { $set: { 
    ...req.body,
    updatedAt: new Date()
  }};

  meeting = { ...meeting, ...update.$set };

  if (meeting.status === MeetingStatus.UPCOMING && isClosed(meeting)) {
    update.$set = { ...update.$set, status: MeetingStatus.CLOSED };
  }

  if (!await updateMeeting(meetingId, update)) {
    res.status(500).json({ message: "Failed to update meeting" });
    return;
  }

  res.status(200).json({ message: "Meeting updated!" });
};

const book = async (req: MeetingBookRequest, res: MeetingBookResponse) => {
  const { meetingId } = req.params;
  const { userId, participantInfo, date, slot } = req.body;

  if (!participantInfo || !date || !slot) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const meeting: Meeting | null = await getMeeting(meetingId);
  if (!meeting) {
    res.status(404).json({ message: "Meeting not found" });
    return;
  }

  const { availabilities } = meeting;
  const availability = availabilities.find((a) => a.date === date);

  if (!availability) {
    res.status(400).json({ message: "Invalid date" });
    return;
  }

  const time = availability.slots[slot];
  if (!time) {
    res.status(400).json({ message: "Invalid slot" });
    return;
  }
  if (time.length >= availability.max) {
    res.status(400).json({ message: "Meeting is full" });
    return;
  }

  const isAlreadyBooked = time.find((p) => p.email.toLowerCase() === participantInfo.email.toLowerCase());
  if (isAlreadyBooked) {
    res.status(400).json({ message: "Email already booked" });
    return;
  }
  
  const newParticipant: Participant = isValidUserId(userId) 
    ? { ...participantInfo, userId: new ObjectId(userId) } 
    : { ...participantInfo };
  
  const isSuccessfullyBooked = await updateMeeting(meetingId, {
    $push: { [`availabilities.$[elem].slots.${slot}`]: newParticipant },
  } as any, {
    arrayFilters: [{ "elem.date": date }]
  } as any);

  if (!isSuccessfullyBooked) {
    res.status(500).json({ message: "Failed to book meeting" });
    return;
  }

  const newUpcomingMeeting: UpcomingMeeting = {
    meetingId: meeting._id,
    time: slot,
    date,
    isCancelled: false,
  }

  if (userId && isValidUserId(userId)) {
    try {
      await updateOneDocument<User>(CollectionNames.USER, new ObjectId(userId), { 
        $push: { 
          upcomingMeetings: newUpcomingMeeting
        }} as any);
    } catch (error) {
      // rollback
      await updateMeeting(meetingId, { 
        $pull: { [`availabilities.$[elem].slots.${slot}`]: { email: participantInfo.email } } 
      } as any, {
        arrayFilters: [{ "elem.date": date }]
      } as any);
      res.status(500).json({ message: "Failed to add to user" });
      return;
    }
  }

  res.status(200).json({ message: "Meeting booked!" });
};

const unbook = async (req: MeetingUnbookRequest, res: MeetingUnbookResponse) => {
  const { meetingId } = req.params;
  const { userId, email, date, slot } = req.body;

  if (!isAllowed(req.user.role, userId, req.user.userId)) {
    res.status(403).json({ message: "You are not authorized to unbook this meeting" });
    return;
  }

  if (!email || !date || !slot) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const meeting: Meeting | null = await getMeeting(meetingId);
  if (!meeting) {
    res.status(404).json({ message: "Meeting not found" });
    return;
  }

  const { availabilities } = meeting;
  const availability = availabilities.find((a) => a.date === date);

  if (!availability) {
    res.status(400).json({ message: "Invalid date" });
    return;
  }

  const time = availability.slots[slot];
  if (!time) {
    res.status(400).json({ message: "Invalid slot" });
    return;
  }

  const isSuccessfullyUnbooked = await updateMeeting(meetingId, {
    $pull: { [`availabilities.$[elem].slots.${slot}`]: { email } },
  } as any, {
    arrayFilters: [{ "elem.date": date }]
  } as any);
  
  if (!isSuccessfullyUnbooked) {
    res.status(500).json({ message: "Failed to unbook meeting" });
    return;
  }

  if (userId) {
    try {
      await updateOneDocument<User>(CollectionNames.USER, new ObjectId(userId), { 
        $pull: { 
          upcomingMeetings: { 
            meetingId: meeting._id 
          }
        } 
      } as any);
    } catch (error) {
      // rollback
      await updateMeeting(meetingId, { 
        $push: { [`availabilities.$[elem].slots.${slot}`]: { email } } 
      } as any, {
        arrayFilters: [{ "elem.date": date }]
      } as any);
      res.status(500).json({ message: "Failed to remove from user" });
      return;
    }
  }

  res.status(200).json({ message: "Meeting unbooked!" });
};

const cancel = async (req: MeetingCancelRequest, res: MeetingCancelResponse) => {
  const { meetingId } = req.params;
  const { date, slot } = req.body;

  if (!date || !slot) {
    res.status(400).json({ message: "Missing required fields, cancelling meeting failed" });
    return;
  }

  const meeting: Meeting | null = await getMeeting(meetingId);
  if (!meeting) {
    res.status(404).json({ message: "Meeting not found" });
    return;
  }

  if (!isAllowed(req.user.role, meeting.hostId.toString(), req.user.userId)) {
    res.status(403).json({ message: "You are not authorized to cancel this meeting" });
    return;
  }

  const availability = meeting.availabilities.find((a) => a.date === date);
  if (!availability) {
    res.status(400).json({ message: "Invalid date" });
    return;
  }

  const time = availability.slots[slot];
  if (!time) {
    res.status(400).json({ message: "Invalid slot" });
    return;
  }
  
  let userIds = time.map((p) => p.userId).filter((id) => !!id); // filter out undefined userIds

  try {
    userIds = userIds.map((id) => new ObjectId(id));
  } catch(error) {
    res.status(400).json({ message: "Invalid userIds" });
    return;
  }

  try {
    const userCollection = await getCollection<User>(CollectionNames.USER);
    const result = await userCollection.updateMany(
      {
        _id: { $in: userIds },
        upcomingMeetings: {
          $elemMatch: {
            meetingId: meeting._id,
            date: date,
            time: slot
          }
        }
      },
      {
        $set: { "upcomingMeetings.$.isCancelled": true }
      }
    );
    if (result.modifiedCount !== userIds.length) throw new Error("Modified count does not match userIds length");
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: "Failed to cancel meeting slot for users" });
    return;
  }

  res.status(200).json({ message: "Meeting slot cancelled successfully" });
};

export default {
  getInfo,
  create,
  update,
  book,
  unbook,
  cancel
};