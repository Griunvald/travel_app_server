import AppError from '../middleware/error/AppError.js';

class ProfileController {
    constructor(profileRepository) {
        this.profileRepository = profileRepository;
    }

    async updateProfile(req, res, next) {
        const {about, avatar, country, home_town, gender } = req.body;
        const userId = JSON.parse(req.query.userId);
        const profileData = {
            about,
            avatar,
            country,
            home_town,
            gender
        };

        try {
        const profile = await this.profileRepository.updateProfile(userId, profileData);
        console.log('Profile from controller: ', profile);
        res.status(201).json(profile);
        } catch (err) {
            console.error(err);
            next(new AppError('Internal server error', 500));
            }
        }
    }


export default ProfileController;
