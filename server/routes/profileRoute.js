import { Router } from 'express';
import ProfileController from '../controllers/ProfileController.js';
import ProfileRepository from '../repositories/ProfileRepository.js';

const router = Router();
const profileController = new ProfileController(ProfileRepository);

router
    .put('/update-profile', profileController.updateProfile.bind(profileController))
    .get('/get-profile', profileController.getProfile.bind(profileController))

export default router;

