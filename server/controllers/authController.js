import AuthRepository from '../repositories/AuthRepository.js';

class AuthController {
    constructor(AuthRepository) {
        this.authRepository = AuthRepository;
    }

    async register(req, res) {
        const { email, fullname, username, password } = req.body;
        try {
        const newUser = await this.authRepository.createUser(email, fullname, username, password);
        const token = newUser.token;
        res.cookie('access_token', token, {httpOnly: true});
        res.status(201).json({ message: 'User was created!' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default AuthController;
