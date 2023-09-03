import AppError from '../middleware/error/AppError.js';

class RecordController {
    constructor(RecordRepository, TagService){
        this.recordRepository = RecordRepository;
        this.tagService = TagService;
    }    

    async createRecord(req, res, next){
        const {userId, tripId, type, data, tags } = req.body;
        console.log(tags);
        let recordId;
        try{
            const recordId = await this.recordRepository.createRecord(userId, tripId, type, data);
            if(tags && tags.length > 0){
                const tagIds = await this.tagService.createTagsAndReturnIds(tags);
                await this.recordRepository.associateTagsWithRecord(recordId, tagIds);
            }
           res.status(201).json({ message: 'Record created!'});
        } catch(err) {
            console.error(err);
            next(new AppError('Internal server error'));
        }
    }

    async editTextRecord(req, res, next){
        const { textRecordId, textValue } = req.body;
        try{
            await this.recordRepository.editTextRecord(textRecordId, textValue);
           res.status(201).json({ message: 'Record was successfully edited!'});
        } catch(err) {
            console.error(err);
            next(new AppError('Internal server error'));
        }

    }


    async deleteRecord(req, res, next){
        const { recordId } = req.body;
        try{
            await this.recordRepository.deleteRecord(recordId);
           res.status(200).json({ message: 'Record was successfully deleted!'});
        } catch(err) {
            console.error(err);
            next(new AppError('Internal server error'));
        }

    }

}

export default RecordController;
