import AppError from '../middleware/error/AppError.js';

class FileController {
    constructor(fileRepository){
        this.fileRepository = fileRepository;
    }    

    async getSignedUrl(req, res, next){
            const { userId } = req.body;
            try {

               await this.fileRepository.getSignedUrl(userId);
               res.status(201).json({ message: 'Getted url!'});
            } catch(err) {
                console.error(err);
                next(AppError('Internal server error'));
            }
        }

}

export default FileController;

