
import { Router } from 'express';
import FollowerController from '../controllers/FollowerController.js';
import FollowerRepository from '../repositories/FollowerRepository.js';
import authGuard from '../middleware/authGuard.js';

const router = Router();
const followerController = new FollowerController(FollowerRepository);

router
    .post('/follow-user', authGuard, followerController.followUser.bind(followerController))
    .delete('/unfollow-user', authGuard, followerController.unfollowUser.bind(followerController))
    .get('/get-followers', authGuard, followerController.getFollowers.bind(followerController))

export default router;
