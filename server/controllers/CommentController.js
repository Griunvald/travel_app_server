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
}

export default CommentController;

