import express, { Request, Response } from 'express';
import pollController from '../controller/pollController';

const pollRouter = express.Router();

pollRouter.get('/:id', pollController.getPollVotes);
pollRouter.post('/', pollController.createPoll);

export default pollRouter;