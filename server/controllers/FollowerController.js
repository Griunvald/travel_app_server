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

}

export default FollowerController;

