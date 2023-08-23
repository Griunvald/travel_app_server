import AppError from '../middleware/error/AppError.js';

class RecordController {
    constructor(RecordRepository){
        this.recordRepository = RecordRepository;
    }    

    createRecord(req, res, next){
        try{
           res.status(201).json({ message: 'Record created!'});
        } catch(err) {
            console.error(err);
            next(AppError('Internal server error'));
        }
    }

}

export default RecordController;
