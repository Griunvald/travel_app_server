import AuthRepository from '../repositories/AuthRepository.js';

class AuthController {
    constructor(AuthRepository) {
        this.authRepository = AuthRepository;
    }

    async register(req, res) {
        const { email, fullname, username, password } = req.body;
        try {
        const token = await this.authRepository.createUser(email, fullname, username, password);
        res.cookie('access_token', token, {httpOnly: true});
        res.status(201).json({ message: 'User was created!' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
     
async login(req, res) {
       const {input, password} = req.body;
       try {
           const token = await this.authRepository.login(input, password)
           res.cookie('access_token', token, {httpOnly: true});
           res.status(200).json({ message: 'Cookie set!' });
       }catch(err){
           console.error(err);
           res.status(500).json({ error: 'Internal server error' });
       } 
    }

    logout(req, res){
        try{
           res.cookie('access_token', '', {httpOnly: true, expires: new Date(0)});
           res.status(200).json({ message: 'Logout successfully!' });
        }catch(err){
           console.error(err);
           res.status(500).json({ error: 'Internal server error' });
        }
    }
    
}

export default AuthController;
