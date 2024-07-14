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


  async checkCurrentTripStatus(req, res, next) {
    const { userId } = JSON.parse(req.cookies.user_info);
    try {
      const status = await this.tripRepository.checkCurrentTripStatus(userId);
      if (status === 'closed') {
        return res.status(200).json({ message: 'Trip is closed!' })
      } else {
        res.status(200).json({ message: 'Trip is opened!' })
      }
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error', 500));
    }
  }

  async getTripsList(req, res, next) {
    const { userId } = JSON.parse(req.cookies.user_info);
    try {
      if (!userId) return;
      const tripsListStats = await this.tripRepository.getTripsList(userId);
      res.status(200).json(tripsListStats)
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error', 500));
    }
  }


  async getCurrentTrip(req, res, next) {
    const { userId } = JSON.parse(req.cookies.user_info);
    try {
      if (!userId) return;
      const currentTrip = await this.tripRepository.getCurrentTrip(userId);
      if (currentTrip?.status === 'closed') return;
      res.status(200).json(currentTrip)
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error', 500));
    }
  }

  async getAllTripsPreview(req, res, next) {
    const { limit, offset } = req.params;
    try {
      const allTrips = await this.tripRepository.getAllTripsPreview(limit, offset);
      res.status(200).json(allTrips);
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error', 500));
    }
  }

    


async getCurrentTripRecordsWithTags(req, res) {
    try {
      const userId = req.query.userId;
      if (!userId) {
        return res.status(400).json({ status: 'error', message: 'userId is required' });
      }

      const records = await this.tripService.getCurrentTripRecordsWithTags(userId);
      res.json(records);
    } catch (error) {
      console.error('Error fetching current trip records with tags:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  }

  async getFullCurrentTrip(req, res, next) {
    const { userId } = req.params;
    try {
      const fullTrip = await this.tripService.getFullCurrentTrip(userId);
      res.status(200).json(fullTrip);
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error', 500));
    }
  }

  async getFullTripByUserIdAndTripId(req, res, next) {
    const { userId, tripId } = req.params;
    try {
      const fullTrip = await this.tripService.getFullTripByUserIdAndTripId(userId, tripId);
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
