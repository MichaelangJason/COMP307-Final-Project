import express, { Request, Response } from 'express';
import pollController from '../controller/pollController';
import privateMiddleware from '../middleware/privateMiddleware';

const pollRouter = express.Router();

pollRouter.get('/:pollId', pollController.getPollVotes);
// pollRouter.post('/', privateMiddleware, pollController.createPoll);
pollRouter.put('/:pollId', pollController.updatePollVotes);

export default pollRouter;