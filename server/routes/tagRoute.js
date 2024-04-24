
import { Router } from 'express';
import TagController from '../controllers/TagController.js';
import TagRepository from '../repositories/TagRepository.js';
import RecordRepository from '../repositories/RecordRepository.js';
import TagService from '../services/TagService.js'
import authGuard from '../middleware/authGuard.js';

const router = Router();
const tagController = new TagController(TagRepository, RecordRepository, TagService);

router
  .delete('/:recordId/:tagId', authGuard, tagController.deleteTag.bind(tagController))
  .post('/:recordId/tags', authGuard, tagController.addTag.bind(tagController))

export default router;
