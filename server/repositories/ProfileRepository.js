import dbPool from '../db.js';
import { toCamelCaseDeep } from '../utils/toCamelCase.js';

class ProfileRepository {
  constructor(dbPool) {
    this.pool = dbPool;
  }


async updateProfile(userId, profileData) {
    const client = await this.pool.connect();
    try {
      const checkQuery = 'SELECT 1 FROM profiles WHERE user_id = $1';
      const checkResult = await client.query(checkQuery, [userId]);
      const profileExists = checkResult.rows.length > 0;

      if (!profileExists) {
        const insertQuery = 'INSERT INTO profiles (user_id) VALUES ($1)';
        await client.query(insertQuery, [userId]);
      }

      const updateFields = [];
      const updateValues = [userId];
      let paramIndex = 2;
      for (const [key, value] of Object.entries(profileData)) {
        if (value !== undefined) {
          updateFields.push(`${key} = $${paramIndex}`);
          updateValues.push(value);
          paramIndex++;
        }
      }

      if (updateFields.length === 0) {
        throw new Error('No fields to update');
      }

      const updateQuery = `
        UPDATE profiles
        SET ${updateFields.join(', ')}
        WHERE user_id = $1
      `;

      const result = await client.query(updateQuery, updateValues);
      return result;
    } catch (error) {
      console.error('Error in upsertProfile:', error);
      throw error;
    } finally {
      client.release();
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

};


export default new ProfileRepository(dbPool);
