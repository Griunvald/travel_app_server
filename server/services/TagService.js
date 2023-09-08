import TagRepository from '../repositories/TagRepository.js';

class TagService {
    constructor(tagRepository){
        this.tagRepository = tagRepository;
    }


    async createTagsAndReturnIds(tagNames){
        await this.tagRepository.insertTags(tagNames);
        return this.tagRepository.getTagIdsByNames(tagNames);
    }
}

export default new TagService(TagRepository);
