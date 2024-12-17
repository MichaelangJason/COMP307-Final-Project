import meetingController from "../controller/meetingController";
import privateMiddleware from '../middleware/privateMiddleware';
import { MeetingRequestParams, MeetingCreateParams } from '@shared/types/api/meeting';
import express from "express";

const meetingRouter = express.Router();

// get meeting info
meetingRouter.get('/:meetingId', meetingController.getInfo);
// create new meeting
meetingRouter.post('/:hostId', privateMiddleware<MeetingCreateParams>, meetingController.create);
// update meeting
meetingRouter.put('/:meetingId', privateMiddleware<MeetingRequestParams>, meetingController.update);
// book a meeting
meetingRouter.put('/book/:meetingId', meetingController.book);
// unbook from a meeting
meetingRouter.put('/unbook/:meetingId', privateMiddleware<MeetingRequestParams>, meetingController.unbook);
// cancel a meeting slot
meetingRouter.put('/cancel/:meetingId', privateMiddleware<MeetingRequestParams>, meetingController.cancel);

export default meetingRouter;