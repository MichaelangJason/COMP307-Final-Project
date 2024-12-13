import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Poll, PollOption } from "@shared/types/db/poll";
import { Meeting } from "@shared/types/db/meeting";
import { ObjectId } from "mongodb";
import { getCollection, getDocument } from "../utils/db";
import { CollectionNames } from "./constants";

const createPoll = async (req: Request, res: Response): Promise<void> => {
    try {
        const { meetingId, options, timeout, results } = req.body;

        // Validation for incoming data
        if (!meetingId || !options || !timeout || !results) {
            res.status(400).json({ message: "Required fields missing" });
            return;
        }

        // Validate the timeout is a future date
        if (new Date(timeout) <= new Date()) {
            res.status(400).json({ message: "Timeout must be a future date" });
            return;
        }
        const meetingCollection = await getCollection<Meeting>(CollectionNames.MEETING);
        const meeting = await meetingCollection.findOne({ _id: meetingId } as any);

        // Prepare poll document
        const poll: Poll = {
            _id: new ObjectId(),
            hostId: new ObjectId(meeting?.hostId),
            meetingId: new ObjectId(meetingId),
            options: options.map((option: PollOption) => ({
                ...option,
                slots: option.slots || {},
            })),
            timeout: new Date(timeout),
            results: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const pollsCollection = await getCollection<Poll>(CollectionNames.POLL);
        const result = await pollsCollection.insertOne(poll);

        // Return the created poll
        res.status(201).json({
            message: "Poll created successfully",
            pollId: result.insertedId,
        });
    } catch (error) {
        console.error("Error creating poll:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


const getPollVotes = async (req: Request, res: Response): Promise<void> => {
    try {
        const pollId= new ObjectId(req.params.id);

        const pollsCollection = await getCollection<Poll>(CollectionNames.POLL);
        const poll = await pollsCollection.findOne({ _id: pollId } as any);

        if (!poll) {
            res.status(404).json({ message: "Poll not found" });
            return;
        }

        // Check if the poll has expired
        const currentTime = new Date();
        const pollStatus = currentTime > poll.timeout ? "expired" : "active";

        res.json({
            pollId: poll._id,
            options: poll.options,
            results: poll.results,  // Could be enhanced to show individual option results
            status: pollStatus,
        });
    } catch (error) {
        console.error("Error fetching poll votes:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

const updatePollVotes = async (req: Request, res: Response): Promise<void> => {
    try {
        const pollId = new ObjectId(req.params.id);
        const { date, slot } = req.body;

        if (!date || !slot) {
            res.status(400).json({ message: "Both 'date' and 'slot' are required in the request body" });
            return;
        }

        const pollsCollection = await getCollection<Poll>(CollectionNames.POLL);
        const poll = await pollsCollection.findOne({ _id: pollId } as any);
        console.log("Poll votes: ", pollId, poll?.options)
        const result = await pollsCollection.updateOne(
            {
                _id: pollId as any, 
                "options.date": date,
                [`options.slots.${slot}`]: { $exists: true }
            },
            {
                $inc: { [`options.$.slots.${slot}`]: 1 }
            }
        );

        if (result.matchedCount === 0) {
            res.status(404).json({ message: "Poll or specified slot not found" });
            return;
        }
        console.log("Succesfully voted for: ", pollId, poll?.options)

        res.status(200).json({ message: "Vote updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

export default {
    createPoll,
    getPollVotes,
    updatePollVotes
};