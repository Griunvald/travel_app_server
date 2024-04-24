import { Router } from 'express';
import RecordController from '../controllers/RecordController.js';
import RecordRepository from '../repositories/RecordRepository.js';
import TagService from '../services/TagService.js'
import authGuard from '../middleware/authGuard.js';

const router = Router();
const recordController = new RecordController(RecordRepository, TagService);

router.post('/', authGuard, recordController.createRecord.bind(recordController))
router.patch('/text/:id', authGuard, recordController.editTextRecord.bind(recordController))
router.delete('/text/:id', authGuard, recordController.deleteRecord.bind(recordController))

export default router;
