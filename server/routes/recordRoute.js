import { Router } from 'express';
import RecordController from '../controllers/RecordController.js';
import RecordRepository from '../repositories/RecordRepository.js';

const router = Router();
const recordController = new RecordController(RecordRepository);

router.post('/create-record', recordController.createRecord.bind(recordController));
export default router;
