import AppError from '../middleware/error/AppError.js';

class RecordController {
    constructor(RecordRepository){
        this.recordRepository = RecordRepository;
    }    

    async createRecord(req, res, next){
        const {userId, tripId, type } = req.body;
        try{
            const record = await this.recordRepository.createRecord(userId, tripId, type);
           res.status(201).json({ message: 'Record created!'});
        } catch(err) {
            console.error(err);
            next(new AppError('Internal server error'));
        }
    }

}

export default RecordController;
