import AppError from '../middleware/error/AppError.js';

class RecordController {
  constructor(recordRepository, tagService) {
    this.recordRepository = recordRepository;
    this.tagService = tagService;
  }

  async createRecord(req, res, next) {
    const { tripId, type, data, tags } = req.body;
    const { userId } = JSON.parse(req.cookies.user_info);
    try {
      const recordId = await this.recordRepository.createRecord(userId, tripId, type, data);
      if (tags && tags.length > 0) {
        const tagIds = await this.tagService.createTagsAndReturnIds(tags);
        await this.recordRepository.associateTagsWithRecord(recordId, tagIds);
      }
      res.status(201).json({ message: 'Record created!' });
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error'));
    }
  }

  async editTextRecord(req, res, next) {
    const textRecordId = req.params.id;
    const { textValue } = req.body;
    try {
      await this.recordRepository.editTextRecord(textRecordId, textValue);
      res.status(201).json({ message: 'Record was successfully edited!' });
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error'));
    }
  }


  async editUrlRecord(req, res, next) {
    const urlRecordId = req.params.id;
    const { urlValue } = req.body;
    try {
      await this.recordRepository.editUrlRecord(urlRecordId, urlValue);
      res.status(201).json({ message: 'Record was successfully edited!' });
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error'));
    }
  }

  async deleteRecord(req, res, next) {
    const recordId = req.params.id;
    const { userId } = JSON.parse(req.cookies.user_info);
    const { type } = req.body;

    try {
      const recordDetails = await this.recordRepository.getRecordWithDetails(recordId);
      if (!recordDetails) {
        return res.status(404).json({ message: 'Record not found' });
      }

      if (userId !== recordDetails.userId) {
        return res.status(403).json({ message: 'Not authorized to delete this record' });
      }

      await this.recordRepository.deleteRecord(recordId, type);
      res.status(200).json({ message: 'Record was successfully deleted!' });
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error'));
    }
  }
}

export default RecordController;
