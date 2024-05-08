import AppError from '../middleware/error/AppError.js';

class LikeController {
  constructor(likeRepository) {
    this.likeRepository = likeRepository;
  }

  async addLike(req, res, next) {
    try {
      await this.likeRepository.addLike();
      res.status(201).json({ message: 'Like added!' });
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error'));
    }
  }

}

export default LikeController;

