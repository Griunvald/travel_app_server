import AppError from '../middleware/error/AppError.js';

class TagController {
    constructor(tagRepository, recordRepository, tagService){
        this.tagRepository = tagRepository;
        this.recordRepository = recordRepository;
        this.tagService = tagService;
    }
    
    async deleteTag(req, res, next){
        const { recordId, tagId } = req.body;

        try{
            await this.tagRepository.removeTagFromRecord(recordId, tagId);
           res.status(200).json({ message: 'Tag was deleted!'});
        } catch(err) {
            console.error(err);
            next(new AppError('Internal server error'));
        }
    }


    async addTag(req, res, next){
        const { recordId, tags } = req.body;

        try{
            const tagIds = await this.tagService.createTagsAndReturnIds(tags);
            await this.recordRepository.associateTagsWithRecord(recordId, tagIds);
           res.status(200).json({ message: 'Tag(s) were added!'});
        } catch(err) {
            console.error(err);
            next(new AppError('Internal server error'));
        }
    }

    
}

export default TagController;
