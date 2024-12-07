import { Router } from 'express';
import requestController from '../controller/requestController';

const requestRouter = Router();

// create request
requestRouter.post('/create', requestController.create);
// update request
requestRouter.put('/:requestId', requestController.update);
// get request info by id
requestRouter.get('/:requestId', requestController.getInfo);

export default requestRouter;