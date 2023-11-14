import dbPool from '../db.js';

class ProfileRepository {
    constructor(dbPool){
        this.pool = dbPool;
    }


    async  updateProfile(userId, profileData) {
            const client = await this.pool.connect();
        const { about, avatar, country, home_town, gender } = profileData;

        const query = ` INSERT INTO profiles (user_id, about, avatar, country, home_town, gender) 
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (user_id) 
        DO UPDATE SET about = EXCLUDED.about, avatar = EXCLUDED.avatar, country = EXCLUDED.country,
            home_town = EXCLUDED.home_town, gender = EXCLUDED.gender;`
            try {
                return await client.query(query, [userId, about, avatar, country, home_town, gender]);
            } catch (error) {
                console.error('Error in updateProfile:', error);
                throw error;
            }
        }
};

export default new ProfileRepository(dbPool);

