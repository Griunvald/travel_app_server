import AppError from '../middleware/error/AppError.js';

class FollowerController {
    constructor(followerRepository){
        this.followerRepository = followerRepository;
    }    

    async followUser(req, res, next){
            const { leaderId, followerId } = req.body;
            try {
               await this.followerRepository.followUser(leaderId, followerId);
               res.status(201).json({ message: 'Start following!' });
            } catch(err) {
                console.error(err);
                next(new AppError('Internal server error'));
            }
        }

    async unfollowUser(req, res, next){
            const { leaderId, followerId } = req.body;
            try {
               await this.followerRepository.unfollowUser(leaderId, followerId);
               res.status(200).json({ message: 'Stop following!' });
            } catch(err) {
                console.error(err);
                next(new AppError('Internal server error'));
            }
        }

    async getFollowers(req, res, next){
            const { userId } = req.body;
            try {
               const followers = await this.followerRepository.getFollowers(userId);
               res.status(200).json({ followers });
            } catch(err) {
                console.error(err);
                next(new AppError('Internal server error'));
            }
        }

    async getFollowing(req, res, next){
            const { userId } = req.body;
            try {
               const following = await this.followerRepository.getFollowing(userId);
               res.status(200).json({ following });
            } catch(err) {
                console.error(err);
                next(new AppError('Internal server error'));
            }
        }
}

export default FollowerController;

