import meetingController from "../controller/meetingController";
import express from "express";

const meetingRouter = express.Router();

// get meeting info
meetingRouter.get('/:meetingId', meetingController.getInfo);
// create new meeting
meetingRouter.post('/create/:hostId', meetingController.create);
// update meeting
meetingRouter.put('/update/:meetingId', meetingController.update);
// book a meeting
meetingRouter.put('/book/:meetingId', meetingController.book);
// unbook from a meeting
meetingRouter.put('/unbook/:meetingId', meetingController.unbook);

export default meetingRouter;