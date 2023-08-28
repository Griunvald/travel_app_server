import AppError from '../middleware/error/AppError.js';

class RecordController {
    constructor(RecordRepository, TagService){
        this.recordRepository = RecordRepository;
        this.tagService = TagService;
    }    

    async createRecord(req, res, next){
        const {userId, tripId, type, data, tags } = req.body;
        console.log(tags);
        try{
            const record = await this.recordRepository.createRecord(userId, tripId, type, data);
            if(tags && tags.length > 0){
                await this.tagService.createTagsAndReturnIds(tags);
            }
           res.status(201).json({ message: 'Record created!'});
        } catch(err) {
            console.error(err);
            next(new AppError('Internal server error'));
        }
    }

}

export default RecordController;
