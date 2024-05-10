import { Router } from 'express';
import LikeController from '../controllers/LikeController.js';
import LikeRepository from '../repositories/LikeRepository.js';

const router = Router();
const likeController = new LikeController(LikeRepository);

router.post('/:type/:id', likeController.addLike.bind(likeController));
router.delete('/:type/:id', likeController.removeLike.bind(likeController));
router.get('/user/:type/:id', likeController.getUserLikesCountByType.bind(likeController));
router.get('/item/:type/:id', likeController.getItemLikesCountByType.bind(likeController));



export default router;

