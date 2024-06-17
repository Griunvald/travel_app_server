import { Router } from 'express';
import ProfileController from '../controllers/ProfileController.js';
import ProfileRepository from '../repositories/ProfileRepository.js';

const router = Router();

const profileController = new ProfileController(ProfileRepository);
router
  .patch('/profile', profileController.updateProfile.bind(profileController))
  .get('/profile/:id', profileController.getProfile.bind(profileController))

export default router;

