import TagRepository from '../repositories/TagRepository.js';

class TagService {
    constructor(TagRepository){
        this.tagRepository = TagRepository;
    }


    async createTagsAndReturnIds(tagNames){
        await this.tagRepository.insertTags(tagNames);
        return this.tagRepository.getTagIdsByNames(tagNames);
    }
}

export default new TagService(TagRepository);
