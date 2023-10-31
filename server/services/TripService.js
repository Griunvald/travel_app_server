import TripRepository from '../repositories/TripRepository.js';

class TripService {
  constructor(tripRepository) {
    this.tripRepository = tripRepository;
  }

  async getFullTrip(userId) {
    try {
      const tripDetails = await this.tripRepository.getCurrentTrip(userId);

      if (!tripDetails) {
        // Handle the case where no current trip is found later
        return null;
      }

      const recordsWithTags = await this.tripRepository.getCurrentTripRecordsWithTags(userId);

      return {
        tripDetails,
        records: recordsWithTags
      };

    } catch (err) {
      console.error(err);
      throw err;
    }
  }

}

export default new TripService(TripRepository);

