import { Router } from 'express';
import RecordController from '../controllers/RecordController.js';
import RecordRepository from '../repositories/RecordRepository.js';
import TagService from '../services/TagService.js'
import authGuard from '../middleware/authGuard.js';

const router = Router();
const recordController = new RecordController(RecordRepository, TagService);

router.post('/create-record', authGuard, recordController.createRecord.bind(recordController))
router.patch('/edit-text-record', authGuard, recordController.editTextRecord.bind(recordController))
router.delete('/delete-text-record', authGuard, recordController.deleteTextRecord.bind(recordController))

export default router;
