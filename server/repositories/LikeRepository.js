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
}

export default new LikeRepository(dbPool);

