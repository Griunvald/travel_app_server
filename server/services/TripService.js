import TripRepository from '../repositories/TripRepository.js';

class TripService {
  constructor(tripRepository) {
    this.tripRepository = tripRepository;
  }

  async getFullCurrentTrip(userId) {
    try {
      const tripDetails = await this.tripRepository.getCurrentTrip(userId);

      if (!tripDetails) {
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

  async getFullTripByUserIdAndTripId(userId, tripId) {
    try {
      const tripDetails = await this.tripRepository.getFullTripByUserIdAndTripId(userId, tripId);

      if (!tripDetails) {
        return null;
      }

      const recordsWithTags = await this.tripRepository.getTripRecordsWithTags(userId, tripId);

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

