import { getDocument, insertDocument, updateOneDocument, MeetingRepeat, getCollection } from "../../utils";
import { CollectionNames } from "../constants";
import { ObjectId, UpdateFilter } from "mongodb";
import { Meeting, MeetingAvailability, UpcomingMeeting, User } from "@shared/types/db";

export const getMeeting = async (meetingId: string): Promise<Meeting | null> => {
  try {
    return await getDocument<Meeting>(CollectionNames.MEETING, new ObjectId(meetingId));
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const insertMeeting = async (meeting: Meeting): Promise<ObjectId | null> => {
  try {
    return await insertDocument<Meeting>(CollectionNames.MEETING, meeting);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateMeeting = async (meetingId: string, update: UpdateFilter<Meeting>, options: any = undefined): Promise<boolean> => {
  try {
    return await updateOneDocument<Meeting>(CollectionNames.MEETING, new ObjectId(meetingId), update, options);
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const isClosed = (meeting: Meeting) => {
  if (meeting.repeat.type === MeetingRepeat.WEEKLY) {
    // recurring meeting has ended
    return new Date() > new Date(`${meeting.repeat.endDate}T00:00:00`);
  } else {
    const lastAvailability = meeting.availabilities[meeting.availabilities.length - 1];
    const lastDate = new Date(`${lastAvailability.date}T23:59:59`); // end of day

    return lastDate < new Date();
  }
}

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export const nextAvailability = (availability: MeetingAvailability, mult: number, endDate: string): MeetingAvailability | null => {
  const { date, slots } = availability;

  let nextDate = new Date(`${date}T00:00:00`);
  nextDate.setDate(nextDate.getDate() + mult * 7);

  // check if nextDate is still in the past, then find on in future
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

export const updateFutureAvailabilities = async (meeting: Meeting) => {
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
    // check if the no equal date in newAvailabilities
    newAvailabilities.push(newAvailability);
  }

  // remove first len(newAvailabilities) availabilities
  const lenA = newAvailabilities.length;
  // filter out duplicate dates
  newAvailabilities = newAvailabilities.filter((a, index, self) => index === self.findIndex(t => t.date === a.date));
  const lenB = lenA - newAvailabilities.length;
  const newArrSize = availabilities.length - lenB;

  // console.log(popSize);
  if (lenA > 0) {
    await updateMeeting(meetingId.toString(), {
      $push: { 
        availabilities: 
        { 
          $each: newAvailabilities,
          $slice: -newArrSize // the array length unchanged, keep the last availabilities
        } 
      },
      $set: { updatedAt: new Date() }
    } as any);
  }
  return { newAvailabilities, newArrSize };
}

export const isValidAvailabilities = (availabilities: MeetingAvailability[]) => {
  if (!availabilities) return { isValid: false, message: "No availabilities provided" };
  // check for empty availabilities
  const atLeastOne = availabilities.length > 0;
  // check for availabilities with no slots
  const noEmptyAvailabilities = availabilities.every((availability) => Object.values(availability.slots).length > 0);
  // check for empty slots, will not allow if update, so commented out
  // const noEmptySlots = availabilities.every((availability) => 
  //   Object.values(availability.slots).every((slots) => slots.length === 0)
  // );

  // check for duplicate dates
  const dates = availabilities.map(a => a.date);
  const uniqueDates = new Set(dates);
  const noDuplicates = dates.length === uniqueDates.size;

  // check if all dates are in the future
  const allFutureDates = availabilities.every((availability) => {
    if (Object.values(availability.slots).length === 0) return true; // is not this error
    const firstStartTime = Object.keys(availability.slots).at(0)!.split("-")[0];
    return new Date(`${availability.date}T${firstStartTime}:00`) > new Date();
  });

  let message = "";
  if (!atLeastOne) message += "At least one availability is required.\n";
  if (!noEmptyAvailabilities) message += "No empty availabilities allowed.\n";
  // if (!noEmptySlots) message += "No empty slots allowed.\n";
  if (!noDuplicates) message += "No duplicate dates allowed.\n";
  if (!allFutureDates) message += "All dates and slotsmust be in the future.\n";

  return { isValid: atLeastOne && noEmptyAvailabilities && noDuplicates && allFutureDates, message };
}

export const isValidUserId = (userId: string | undefined) => {
  return userId && ObjectId.isValid(userId);
}

export const createPollOptions = (availabilities: MeetingAvailability[]) => {
  return availabilities.map((availability) => ({
    date: availability.date,
    slots: Object.fromEntries(Object.entries(availability.slots).map(([time, _]) => [time, 0])),
  }));
}

export const cancelMeetingSlot = async (meetingId: string, date: string, slot: string, userIds: ObjectId[]) => {
  const userCollection = await getCollection<User>(CollectionNames.USER);
  const result = await userCollection.updateMany(
    {
      _id: { $in: userIds },
      upcomingMeetings: {
        $elemMatch: {
          meetingId: new ObjectId(meetingId),
          date: date,
          time: slot
        }
      }
    },
    {
      $set: { "upcomingMeetings.$.isCancelled": true }
    }
  );
  // if (result.modifiedCount !== userIds.length) throw new Error("Modified count does not match userIds length");
  // Clear the slot using the same pattern as booking
  const isSlotCleared = await updateMeeting(meetingId, {
    $set: { [`availabilities.$[elem].slots.${slot}`]: [] }
  } as any, {
    arrayFilters: [{ "elem.date": date }]
  } as any);

  return result.modifiedCount === userIds.length && isSlotCleared;
}

export const createUpcomingMeetings = (availabilities: MeetingAvailability[], meeting: Meeting, host: User) => {
  const upcomingMeetings: UpcomingMeeting[] = [];

  for (const availability of availabilities) {
    const date = availability.date;
    for (const slot in availability.slots) {
      upcomingMeetings.push({
        meetingId: meeting._id,
        title: meeting.title,
        hostFirstName: host.firstName,
        hostLastName: host.lastName,
        location: meeting.location,
        time: slot,
        date,
        isCancelled: false,
      });
    }
  }
  
  return upcomingMeetings;
}

export const pushFutureAvailabilities = async (availabilities: MeetingAvailability[], endDate: string) => {
  const futureAvailabilities: MeetingAvailability[] = [];
    // add 3 future availabilities
    for (let i = 1; i < 4; i++) {
      availabilities.forEach((availability) => {
        const next = nextAvailability(availability, i, endDate);
        if (next) {
          futureAvailabilities.push(next);
        }
      });
  }
  availabilities.push(...futureAvailabilities);
  // sort availabilities by date
  availabilities.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return availabilities;
}