import dbPool from '../db.js';
import { toCamelCaseDeep } from '../utils/toCamelCase.js';

class ProfileRepository {
  constructor(dbPool) {
    this.pool = dbPool;
  }


  async updateProfile(userId, profileData) {
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


  async getProfile(userId) {
    const client = await this.pool.connect();

    const query = `SELECT about, avatar, country, home_town, gender FROM profiles WHERE user_id = $1`
    try {
      const result = await client.query(query, [userId]);
      const profile = await result.rows[0] ? toCamelCaseDeep(result.rows[0]) : {};
      return profile;
    } catch (error) {
      console.error('Error in getProfile:', error);
      throw error;
    }
  }

  async getProfiles(limit, offset) {
    const client = await this.pool.connect();

    const query = `
        SELECT about, avatar, country, home_town, gender 
        FROM profiles 
        ORDER BY user_id 
        LIMIT $1 OFFSET $2`;

    try {
      const result = await client.query(query, [limit, offset]);
      return result.rows.map(row => toCamelCaseDeep(row));
    } catch (error) {
      console.error('Error in getProfiles:', error);
      throw error;
    } finally {
      client.release();
    }
  }

};


export default new ProfileRepository(dbPool);
