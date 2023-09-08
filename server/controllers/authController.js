import AppError from '../middleware/error/AppError.js';

class AuthController {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }

    async register(req, res, next) {
        const { email, fullname, username, password } = req.body;
        try {
        const token = await this.authRepository.createUser(email, fullname, username, password);
        res.cookie('access_token', token, {httpOnly: true});
        res.status(201).json({ message: 'User was created!' });
        } catch (err) {
            if(err.message === 'Username already taken!') {
            next(new AppError(err.message, 400));
            } else {
            console.error(err);
            next(new AppError('Internal server error', 500));
            }
        }
    }
     
async login(req, res, next) {
       const {input, password} = req.body;
       try {
           const token = await this.authRepository.login(input, password)
           if(!token) return res.status(401).json({message: 'Account not found!'});
           res.cookie('access_token', token, {httpOnly: true});
           res.status(200).json({ message: 'Cookie set!' });
       }catch(err){
           console.error(err);
           next(new AppError('Internal server error', 500));
       } 
    }

    logout(req, res, next){
        try{
           res.cookie('access_token', '', {httpOnly: true, expires: new Date(0)});
           res.status(200).json({ message: 'Logout successfully!' });
        }catch(err){
           console.error(err);
           next(new AppError('Internal server error', 500));
        }
    }
    
}

export default AuthController;
