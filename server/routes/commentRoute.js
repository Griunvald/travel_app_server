import { Router } from 'express';
import CommentController from '../controllers/CommentController.js';
import CommentRepository from '../repositories/CommentRepository.js';

const router = Router();
const commentController = new CommentController(CommentRepository);

router.post('/create-comment', commentController.createComment.bind(commentController))
router.delete('/delete-comment', commentController.deleteComment.bind(commentController))

export default router;
