import { Router } from 'express';
import TripController from '../controllers/TripController.js';
import TripRepository from '../repositories/TripRepository.js';
import authGuard from '../middleware/authGuard.js';

const router = Router();
const tripController = new TripController(TripRepository);

router
    .post('/create-trip', authGuard, tripController.createTrip.bind(tripController))

export default router;
