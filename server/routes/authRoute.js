import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';
import AuthRepository from '../repositories/AuthRepository.js';

const router = Router();
const authController = new AuthController(AuthRepository);

router
    .post('/register', authController.register.bind(authController))
    .post('/login', authController.login.bind(authController))
    .post('/logout');

export default router;
