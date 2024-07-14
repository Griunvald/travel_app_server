import { Router } from 'express';
import TripController from '../controllers/TripController.js';
import TripRepository from '../repositories/TripRepository.js';
import TripService from '../services/TripService.js'
import authGuard from '../middleware/authGuard.js';

const router = Router();
const tripController = new TripController(TripRepository, TripService);

router
  .post('/', authGuard, tripController.createTrip.bind(tripController))
  .patch('/close', authGuard, tripController.endCurrentTrip.bind(tripController))
  .get('/current', authGuard, tripController.getCurrentTrip.bind(tripController))
  .get('/full/current/:userId', tripController.getFullCurrentTrip.bind(tripController)) 
  .get('/full/:userId/:tripId', tripController.getFullTripByUserIdAndTripId.bind(tripController)) 
  .get('/preview/:limit/:offset', tripController.getAllTripsPreview.bind(tripController))
  .get('/count', authGuard, tripController.getTripsCount.bind(tripController))
  .get('/current/records/tags', tripController.getCurrentTripRecordsWithTags.bind(tripController))
  .get('/status', tripController.checkCurrentTripStatus.bind(tripController))
  .get('/list', tripController.getTripsList.bind(tripController))

export default router;

