import AppError from '../middleware/error/AppError.js';

class CommentController {
    constructor(commentRepository){
        this.commentRepository = commentRepository;
    }    

    async createComment(req, res, next){
            const {tripId, userId, body} = req.body;
            try {
               await this.commentRepository.createComment(tripId, userId, body);
               res.status(201).json({message: 'Comment was created!'});
            } catch(err) {
                console.error(err);
                next(new AppError('Internal server error'));
            }
        }

    async deleteComment(req, res, next){
            const {commentId} = req.body;
            try {
               await this.commentRepository.deleteComment(commentId);
               res.status(200).json({message: 'Comment was deleted!'});
            } catch(err) {
                console.error(err);
                next(new AppError('Internal server error'));
            }
        }
}

export default CommentController;

