
import { Router } from 'express';
import TagController from '../controllers/TagController.js';
import TagRepository from '../repositories/TagRepository.js';

const router = Router();
const tagController = new TagController(TagRepository);

router
    .delete('/delete-tag', tagController.deleteTag.bind(tagController))
    .delete('/add-tag', tagController.addTag.bind(tagController))

export default router;
