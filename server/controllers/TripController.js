import AppError from '../middleware/error/AppError.js';

class TripController {
    constructor(tripRepository){
        this.tripRepository = tripRepository;
    }

   async createTrip(req, res, next){
       const {userId, title, description, url} = req.body;
        try {
           const trip = await this.tripRepository.createTrip(userId, title, description, url);
            if(trip === 'open') return res.status(400).json({message: 'Please, close your previous trip!'})
            res.cookie('trip_info', trip, {httpOnly: true});
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
    async endCurrentTrip(req, res, next){
        const {userId} = req.body;
        try {
            const status = await this.tripRepository.endCurrentTrip(userId);
            console.log("Trip status is: ", status);
            if(status === 'closed'){
               return res.status(200).json({message: 'Trip already closed!'})
            } else {
               res.status(200).json({message: 'Trip was closed!'})
            }
        } catch (err){
           console.error(err);
           next(new AppError('Internal server error', 500));
        }

    }

    async getCurrentTrip(req, res, next){
        const {userId} = req.body;
        try {
            const currentTrip = await this.tripRepository.getCurrentTrip(userId);
            res.status(200).json({message: currentTrip})
        } catch (err){
           console.error(err);
           next(new AppError('Internal server error', 500));
        }
    }

   async getCurrentTripRecordsWithTags(req, res, next){
        const {userId} = req.body;
        try {
            const currentTripRecordsData = await this.tripRepository.getCurrentTripRecordsWithTags(userId);
            res.status(200).json({message: currentTripRecordsData})
        } catch (err){
           console.error(err);
           next(new AppError('Internal server error', 500));
        }

   }
}

export default TripController;
