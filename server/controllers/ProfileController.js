import AppError from '../middleware/error/AppError.js';

class ProfileController {
  constructor(profileRepository) {
    this.profileRepository = profileRepository;
  }

  async updateProfile(req, res, next) {
    const { about, avatar, country, home_town, gender } = req.body;
    const { userId } = JSON.parse(req.cookies.user_info);
    const profileData = {
      about,
      avatar,
      country,
      home_town,
      gender
    };

    try {
      await this.profileRepository.updateProfile(userId, profileData);
      res.status(201).json("Profile was successfully updated!");
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error', 500));
    }
  }


  async getProfile(req, res, next) {
    const { userId } = JSON.parse(req.cookies.user_info);
    try {
      const profile = await this.profileRepository.getProfile(userId);
      res.status(200).json(profile);
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error', 500));
    }
  }


  async getProfiles(req, res, next) {
    const limit = JSON.parse(req.query.limit);
    const offset = JSON.parse(req.query.offset);

    try {
      const profiles = await this.profileRepository.getProfiles(limit, offset);
      res.status(201).json(profiles);
    } catch (err) {
      console.error(err);
      next(new AppError('Internal server error', 500));
    }
  }
}


export default ProfileController;
