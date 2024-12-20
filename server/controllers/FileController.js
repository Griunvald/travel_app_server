import AppError from '../middleware/error/AppError.js';

class FileController {
    constructor(fileRepository){
        this.fileRepository = fileRepository;
    }    

    async getSignedUrl(req, res, next){
        const userInfo = JSON.parse(req.cookies.user_info);
const userId = userInfo.userId;
            try {
               const signedUrl = await this.fileRepository.getSignedUrl(userId);
               res.status(200).json({ signedUrl });
            } catch(err) {
                console.error(err);
                next(new AppError('Internal server error'));
            }
        }

}

export default FileController;

