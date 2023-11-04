import AuthRepository from '../repositories/AuthRepository.js';
import AppError from '../middleware/error/AppError.js';

const authGuard = async (req, res, next) => {
    const token = req.cookies.access_token;
    if(!token){
        return next(new AppError('Unauthorized', 401));
    }

    const userId = await AuthRepository.getUserIdFromToken(token);
    next();

}

export default authGuard;
