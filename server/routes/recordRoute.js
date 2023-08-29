import { Router } from 'express';
import RecordController from '../controllers/RecordController.js';
import RecordRepository from '../repositories/RecordRepository.js';
import TagService from '../services/TagService.js'

const router = Router();
const recordController = new RecordController(RecordRepository, TagService);

router.post('/create-record', recordController.createRecord.bind(recordController));

export default router;