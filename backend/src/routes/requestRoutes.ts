import { Router } from 'express';
import requestController from '../controller/requestController';
import privateMiddleware from '../middleware/privateMiddleware';
import { RequestParams } from '@shared/types/api/request';

const requestRouter = Router();

// create request
requestRouter.post('/:hostId', requestController.create);
// update request
requestRouter.put('/:requestId', privateMiddleware<RequestParams>, requestController.update);
// get request info by id
requestRouter.get('/:requestId', privateMiddleware<RequestParams>,requestController.getInfo);

export default requestRouter;