import AppError from '../middleware/error/AppError.js';

class CommentController {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  async createComment(req, res, next) {
    const { body } = req.body;
    const { tripId } = req.params;
    const { userId } = JSON.parse(req.cookies.user_info);
    try {
      await this.commentRepository.createComment(tripId, userId, body);
      res.status(201).json({ message: 'Comment was created!' });
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error'));
    }
  }

  async deleteComment(req, res, next) {
    const { commentId, commentOwner } = req.params;
    const { userId } = JSON.parse(req.cookies.user_info);
    try {
      const result = await this.commentRepository.deleteComment(commentId, commentOwner, userId);

      if (result === null) {
        return res.status(200).json({ message: 'You can\'t delete comment' });
      } else {
        res.status(200).json({ message: 'Comment was deleted!' });
      }
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error'));
    }
  }

  async getComments(req, res, next) {
    const { tripId } = req.params;
    try {
      const comments = await this.commentRepository.getComments(tripId);
      res.status(200).json({ comments });
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error'));
    }
  }

  async editComment(req, res, next) {
    const { body } = req.body;
    const { commentId, commentOwner } = req.params;
    const { userId } = JSON.parse(req.cookies.user_info);
    try {
      const result = await this.commentRepository.editComment(commentId, commentOwner, userId, body);

      if (result === null) {
        return res.status(200).json({ message: 'You can\'t edit comment' });
      } else {
        res.status(200).json({ message: 'Comment was updated!' });
      }
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error'));
    }
  }
}

export default CommentController;

