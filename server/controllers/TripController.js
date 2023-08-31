import AppError from '../middleware/error/AppError.js';

class TripController {
    constructor(TripRepository){
        this.tripRepository = TripRepository;
    }

   async createTrip(req, res, next){
       const {userId, title} = req.body;
        try {
           const trip = await this.tripRepository.createTrip(userId, title);
            if(trip === 'open') return res.status(400).json({message: 'Please, close your previous trip!'})
           res.status(201).json({message: 'Trip was created!'})
        } catch(err){
            if (title.trim().length === 0) {
               next(new AppError('Please provide a trip title', 400));
            } else if (err.message.includes('duplicate key value violates unique constraint')){
               next(new AppError('Trip title aready exists for this user', 400));
            } else if (err.message.includes('value too long for type character varying(100)')){
               next(new AppError('Trip title too long', 400));
            } else { 
               console.error(err);
               next(new AppError('Internal server error', 500));
            }
        }
    }
}

export default TripController;
