// Jiaju Nie, YuTong Wei
import { Meeting, Poll, UpcomingMeeting, User } from "@shared/types/db";
import { MeetingStatus, UserRole } from "../../utils/statusEnum";
import { CollectionNames } from "../constants";
import { getCollection, getDocument, updateOneDocument } from "../../utils/db";
import { createUpcomingMeetings, updateMeeting } from "./meeting";

export const isAllowed = (role: UserRole, paramsID: any, userID: any) => {
  return  role == UserRole.ADMIN || 
    Number(process.env.BYPASS_AUTH) ||
    paramsID == userID;
}

export const updateUpcomingMeetings = async (host: User) => {
  // get all hosted meetings from database with status VOTING
  const { hostedMeetings } = host;

  const meetingCollection = await getCollection<Meeting>(CollectionNames.MEETING);
  const votingMeetings = await meetingCollection.find({ 
    _id: { $in: hostedMeetings },
    hostId: host._id, 
    status: MeetingStatus.VOTING 
  }).toArray();


  if (votingMeetings.length === 0) {
    return true;
  }

  const upcomingMeetings: UpcomingMeeting[] = host.upcomingMeetings;
  for (const meeting of votingMeetings) {
    const poll = await getDocument<Poll>(CollectionNames.POLL, meeting.pollId!);
    if (!poll) {
      console.error(`Poll not found for meeting ${meeting._id}`);
      return false;
    }
    if (poll.timeout < new Date()) {
      await updateMeeting(meeting._id.toString(), { $set: { status: MeetingStatus.UPCOMING, updatedAt: new Date() } });
      upcomingMeetings.push(...createUpcomingMeetings(meeting.availabilities, meeting, host));
    }
  }

  upcomingMeetings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  await updateOneDocument<User>(CollectionNames.USER, host._id, { $set: { upcomingMeetings } } as any);

  return true;
} 
