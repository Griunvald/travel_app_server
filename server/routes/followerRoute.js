
import { Router } from 'express';
import FollowerController from '../controllers/FollowerController.js';
import FollowerRepository from '../repositories/FollowerRepository.js';
import FollowService from '../services/FollowService.js';
import authGuard from '../middleware/authGuard.js';

const router = Router();
const followerController = new FollowerController(FollowerRepository, FollowService);

router
  .post('/', authGuard, followerController.followUser.bind(followerController))
  .delete('/:id', authGuard, followerController.unfollowUser.bind(followerController))
  .get('/followers', authGuard, followerController.getFollowers.bind(followerController))
  .get('/following', authGuard, followerController.getFollowing.bind(followerController))
  .get('/stats', authGuard, followerController.getFollowStats.bind(followerController))

export default router;
