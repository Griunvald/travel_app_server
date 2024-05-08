import { Router } from 'express';
import LikeController from '../controllers/LikeController.js';
import LikeRepository from '../repositories/LikeRepository.js';

const router = Router();
const likeController = new LikeController(LikeRepository);

router.post('/', likeController.addLike.bind(likeController));
router.delete('/', likeController.addLike.bind(likeController));

export default router;

