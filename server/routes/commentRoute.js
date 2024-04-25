import { Router } from 'express';
import CommentController from '../controllers/CommentController.js';
import CommentRepository from '../repositories/CommentRepository.js';
import authGuard from '../middleware/authGuard.js';

const router = Router();
const commentController = new CommentController(CommentRepository);

router.post('/:tripId', authGuard, commentController.createComment.bind(commentController))
router.delete('/delete-comment', authGuard, commentController.deleteComment.bind(commentController))
router.put('/edit-comment', commentController.editComment.bind(commentController))
router.get('/get-comments', commentController.getComments.bind(commentController))

export default router;
