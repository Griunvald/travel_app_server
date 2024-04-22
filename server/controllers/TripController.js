import AppError from '../middleware/error/AppError.js';

class TripController {
  constructor(tripRepository, tripService) {
    this.tripRepository = tripRepository;
    this.tripService = tripService;
  }

  async createTrip(req, res, next) {
    const { title, description, url } = req.body;
    const { userId, username } = JSON.parse(req.cookies.user_info);
    try {
      const trip = await this.tripRepository.createTrip(userId, username, title, description, url);
      if (trip === 'open') return res.status(400).json({ message: 'Please, close your previous trip!' })
      res.status(201).json(trip);
    } catch (err) {
      if (title.trim().length === 0) {
        next(new AppError('Please provide a trip title', 400));
      } else if (err.message.includes('duplicate key value violates unique constraint')) {
        next(new AppError('Trip title aready exists for this user', 400));
      } else if (err.message.includes('value too long for type character varying(100)')) {
        next(new AppError('Trip title too long', 400));
      } else {
        console.error(err);
        next(new AppError('Internal server error', 500));
      }
    }
  }
  async endCurrentTrip(req, res, next) {
    const { userId } = JSON.parse(req.cookies.user_info);
    try {
      const status = await this.tripRepository.endCurrentTrip(userId);
      if (status === 'closed') {
        return res.status(200).json({ message: 'Trip already closed!' })
      } else {
        res.status(200).json({ message: 'Trip was closed!' })
      }
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error', 500));
    }

  }

  async getCurrentTrip(req, res, next) {
    const { userId } = req.body;
    try {
      const currentTrip = await this.tripRepository.getCurrentTrip(userId);
      res.status(200).json(currentTrip)
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error', 500));
    }
  }

  async getAllTripsPreview(req, res, next) {
    try {
      const allTrips = await this.tripRepository.getAllTripsPreview();
      res.status(200).json(allTrips);
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error', 500));
    }
  }

  async getCurrentTripRecordsWithTags(req, res, next) {
    const userId = JSON.parse(req.query.userId);
    console.log(userId);
    try {
      const currentTripRecordsData = await this.tripRepository.getCurrentTripRecordsWithTags(userId);
      res.status(200).json(currentTripRecordsData.rows)
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error', 500));
    }

  }

  async getFullTrip(req, res, next) {
    const userId = JSON.parse(req.query.userId);
    try {
      const fullTrip = await this.tripService.getFullTrip(userId);
      res.status(200).json(fullTrip);
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error', 500));
    }

  }

  async getTripsCount(req, res, next) {
    const { userId } = JSON.parse(req.cookies.user_info);
    try {
      const tripsCount = await this.tripRepository.getTripsCount(userId);
      res.status(200).json(tripsCount)
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error', 500));
    }

  }


}

export default TripController;
