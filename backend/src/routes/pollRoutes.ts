import express, { Request, Response } from 'express';
import pollController from '../controller/pollController';

const pollRouter = express.Router();

pollRouter.get('/:id', pollController.getPollVotes);
pollRouter.post('/', pollController.createPoll);
pollRouter.put('/:id', pollController.updatePollVotes);

export default pollRouter;