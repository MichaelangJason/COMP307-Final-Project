import { Router } from 'express';
import requestController from '../controller/requestController';

const requestRouter = Router();

// get request info by id
requestRouter.get('/:id', requestController.getInfo);

export default requestRouter;
