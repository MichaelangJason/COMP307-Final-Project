import { getDocument, insertDocument, updateOneDocument, MeetingRepeat } from "../../utils";
import { CollectionNames } from "../constants";
import { ObjectId, UpdateFilter } from "mongodb";
import { Meeting, MeetingAvailability } from "@shared/types/db";

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

export const isValidAvailabilities = (availabilities: MeetingAvailability[]) => {
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

export const isValidUserId = (userId: string | undefined) => {
  try {
    return new ObjectId(userId);
  } catch (error) {
    return undefined;
  }
}

export const createPollOptions = (availabilities: MeetingAvailability[]) => {
  return availabilities.map((availability) => ({
    date: availability.date,
    slots: Object.fromEntries(Object.entries(availability.slots).map(([time, _]) => [time, 0])),
  }));
}