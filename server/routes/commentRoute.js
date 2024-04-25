import { Router } from 'express';
import CommentController from '../controllers/CommentController.js';
import CommentRepository from '../repositories/CommentRepository.js';
import authGuard from '../middleware/authGuard.js';

const router = Router();
const commentController = new CommentController(CommentRepository);

router.post('/:tripId', authGuard, commentController.createComment.bind(commentController))
router.delete('/:commentId/:commentOwner', authGuard, commentController.deleteComment.bind(commentController))
router.put('/:commentId/:commentOwner', commentController.editComment.bind(commentController))
router.get('/:tripId', commentController.getComments.bind(commentController))

export default router;
