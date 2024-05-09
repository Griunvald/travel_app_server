import dbPool from '../db.js';

class LikeRepository {
  constructor(dbPool) {
    this.pool = dbPool;
  }

  async addLike(type, itemId, userId) {
    const client = await this.pool.connect();
    const tableMap = {
      record: 'record_likes',
      comment: 'comment_likes'
    };
    const tableName = tableMap[type];

    if (!tableName) {
      throw new Error('Invalid type provided');
    }

    try {
      const insertQuery = `
            INSERT INTO ${tableName} (${type}_id, user_id) VALUES ($1, $2)
        `;
      await client.query(insertQuery, [itemId, userId]);
    } catch (err) {
      console.error('Error in addLike:', err);
      throw err;
    } finally {
      client.release();
    }
  }


  async removeLike(type, itemId, userId) {
    const client = await this.pool.connect();
    try {
      const tableName = type === 'record' ? 'record_likes' : 'comment_likes';

      const verificationQuery = `
            SELECT user_id FROM ${tableName} WHERE ${type}_id = $1 AND user_id = $2;
        `;
      const verificationResult = await client.query(verificationQuery, [itemId, userId]);

      if (verificationResult.rowCount === 0) {
        return { success: false, message: "You do not have permission to delete this like." };
      }

      const deleteQuery = `
            DELETE FROM ${tableName} WHERE ${type}_id = $1 AND user_id = $2;
        `;
      await client.query(deleteQuery, [itemId, userId]);
      return { success: true, message: "Like removed successfully." };
    } catch (err) {
      console.error('Error removing like:', err);
      throw err;
    } finally {
      client.release();
    }
  }


  async getLikesCount(type, userId) {
    const client = await this.pool.connect();
    try {
      const tableName = type === 'record' ? 'record_likes' : 'comment_likes';
      const selectQuery = `SELECT COUNT(*) AS likes_count FROM ${tableName} WHERE user_id = $1`;
      const result = await client.query(selectQuery, [userId]);
      return result.rows[0].likes_count;
    } catch (err) {
      console.error('Error getting likes count:', err);
      throw err;
    } finally {
      client.release();
    }
  }


}

export default new LikeRepository(dbPool);

