import AppError from '../middleware/error/AppError.js';

class LikeController {
  constructor(likeRepository) {
    this.likeRepository = likeRepository;
  }

  async addLike(req, res, next) {
    const { type, id } = req.params;
    const { userId } = JSON.parse(req.cookies.user_info);
    try {
      await this.likeRepository.addLike(type, id, userId);
      res.status(201).json({ message: 'Like added!' });
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error'));
    }
  }


  async removeLike(req, res, next) {
    const { type, id } = req.params;
    const { userId } = JSON.parse(req.cookies.user_info);
    try {
      await this.likeRepository.removeLike(type, id, userId);
      res.status(200).json({ message: 'Like removed!' });
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error'));
    }
  }



  async getLikesCount(req, res, next) {
    const { type } = req.params;
    const { userId } = JSON.parse(req.cookies.user_info);
    try {
      const likesCount = await this.likeRepository.getLikesCount(type, userId);
      res.status(200).json({ message: `Like count for ${type} is ${likesCount}` });
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error'));
    }
  }



}

export default LikeController;

