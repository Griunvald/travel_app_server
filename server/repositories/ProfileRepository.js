import dbPool from '../db.js';

class ProfileRepository {
    constructor(dbPool){
        this.pool = dbPool;
    }


    async  updateProfile(userId, profileData) {
            const client = await this.pool.connect();
            const setClauses = Object.entries(profileData)
                .map(([key, value]) => `${key} = '${value}'`)
                .join(', ');

            const query = `UPDATE profiles SET ${setClauses} WHERE user_id = ${userId}`;
            try {
                return await client.query(query);
            } catch (error) {
                console.error('Error in updateProfile:', error);
                throw error;
            }
        }
};

export default new ProfileRepository(dbPool);

