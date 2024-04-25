import AppError from '../middleware/error/AppError.js';

class FollowerController {
  constructor(followerRepository, followService) {
    this.followerRepository = followerRepository;
    this.followService = followService;
  }

  async followUser(req, res, next) {
    const leaderId = req.params.id
    const { userId } = JSON.parse(req.cookies.user_info);
    try {
      await this.followerRepository.followUser(leaderId, userId);
      res.status(201).json({ message: 'Start following!' });
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error'));
    }
  }

  async unfollowUser(req, res, next) {
    const { leaderId } = req.body;
    const { userId } = JSON.parse(req.cookies.user_info);
    try {
      await this.followerRepository.unfollowUser(leaderId, userId);
      res.status(200).json({ message: 'Stop following!' });
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error'));
    }
  }

  async getFollowers(req, res, next) {
    const { userId } = req.body;
    try {
      const followers = await this.followerRepository.getFollowers(userId);
      res.status(200).json({ followers });
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error'));
    }
  }

  async getFollowing(req, res, next) {
    const { userId } = JSON.parse(req.cookies.user_info);
    try {
      const following = await this.followerRepository.getFollowing(userId);
      res.status(200).json({ following });
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error'));
    }
  }

  async getFollowStats(req, res, next) {
    const { userId } = JSON.parse(req.cookies.user_info);
    try {
      const stats = await this.followService.getFollowStats(userId);
      res.status(200).json(stats);
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error'));
    }
  }


}

export default FollowerController;

