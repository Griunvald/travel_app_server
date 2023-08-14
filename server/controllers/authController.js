import AuthRepository from '../repositories/AuthRepository.js';

class AuthController {
    constructor(AuthRepository) {
        this.authRepository = AuthRepository;
    }

    async register(req, res) {
        const { email, fullname, password } = req.body;
        try {
        const newUser = await this.authRepository.createUser(email, fullname, password);
        res.status(201).json({ message: 'User was created!' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default AuthController;
