import dbPool from '../db.js';
import { toCamelCaseDeep } from '../utils/toCamelCase.js';

class ProfileRepository {
  constructor(dbPool) {
    this.pool = dbPool;
  }


  async updateProfile(userId, profileData) {
    const client = await this.pool.connect();
    try {
      const updateFields = [];
      const updateValues = [userId];

      let paramIndex = 2;
      for (const [key, value] of Object.entries(profileData)) {
        if (value !== undefined) {
          updateFields.push(`${key} = $${paramIndex}::text`);
          updateValues.push(value);
          paramIndex++;
        }
      }

      if (updateFields.length === 0) {
        throw new Error('No fields to update');
      }

      const query = `
      UPDATE profiles
      SET ${updateFields.join(', ')}
      WHERE user_id = $1
    `;

      return await client.query(query, updateValues);
    } catch (error) {
      console.error('Error in updateProfile:', error);
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
