import { Router } from 'express';
import TripController from '../controllers/TripController.js';
import TripRepository from '../repositories/TripRepository.js';
import TripService from '../services/TripService.js'
import authGuard from '../middleware/authGuard.js';

const router = Router();
const tripController = new TripController(TripRepository, TripService);

router
  .post('/', authGuard, tripController.createTrip.bind(tripController))
  .patch('/close-trip', authGuard, tripController.endCurrentTrip.bind(tripController))
  .post('/get-trip', tripController.getCurrentTrip.bind(tripController))
  .get('/get-full-trip', tripController.getFullTrip.bind(tripController))
  .get('/get-all-trips-preview', tripController.getAllTripsPreview.bind(tripController))
  .get('/get-trips-count', authGuard, tripController.getTripsCount.bind(tripController))
  .get('/get-current-trip-records-with-tags',
    tripController.getCurrentTripRecordsWithTags.bind(tripController))

export default router;
