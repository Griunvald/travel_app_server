import AppError from '../middleware/error/AppError.js';
import TripRepository from '../repositories/TripRepository.js';

class TripController {
    constructor(TripRepository){
        this.tripRepository = TripRepository;
    }

   async createTrip(req, res, next){
       const {userId, title} = req.body;
        try {
           const trip = await this.tripRepository.createTrip(userId, title);
           res.status(201).json({message: 'Trip was created!'})
        } catch(err){
           console.error(err);
           next(new AppError('Internal server error', 500));
        }
    }
}

export default TripController;
