import express, { Request, Response } from 'express';
import pollController from '../controller/pollController';
import privateMiddleware from '../middleware/privateMiddleware';

const pollRouter = express.Router();

pollRouter.get('/:id', pollController.getPollVotes);
pollRouter.post('/', privateMiddleware, pollController.createPoll);
pollRouter.put('/:id', pollController.updatePollVotes);

export default pollRouter;