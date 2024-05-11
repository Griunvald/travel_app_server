import { Router } from 'express';
import LikeController from '../controllers/LikeController.js';
import LikeRepository from '../repositories/LikeRepository.js';
import authGuard from '../middleware/authGuard.js';

const router = Router();
const likeController = new LikeController(LikeRepository);

router.post('/:type/:id', authGuard, likeController.addLike.bind(likeController));
router.delete('/:type/:id', authGuard, likeController.removeLike.bind(likeController));
router.get('/user/:type/:id', authGuard, likeController.getUserLikesCountByType.bind(likeController));
router.get('/item/:type', authGuard, likeController.getItemLikesCountListByType.bind(likeController));



export default router;

