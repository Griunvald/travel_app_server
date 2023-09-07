import AppError from '../middleware/error/AppError.js';

class TagController {
    constructor(tagRepository){
        this.tagRepository = tagRepository;
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
        const {} = req.body;

        try{
            await this.TagRepository.addTag();
           res.status(200).json({ message: 'Tag was added!'});
        } catch(err) {
            console.error(err);
            next(new AppError('Internal server error'));
        }
    }

    
}

export default TagController;
