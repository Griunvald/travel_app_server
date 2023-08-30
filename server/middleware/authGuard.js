import AuthRepository from '../repositories/AuthRepository.js';
import AppError from '../middleware/error/AppError.js';

const authGuard = async (req, res, next) => {
    if(!req.headers.access_token){
        return next(new AppError('Unauthorized', 401));
    }

    const userId = await AuthRepository.getUserIdFromToken(req.headers.access_token);
    console.log(userId);

    next();

}

export default authGuard;
