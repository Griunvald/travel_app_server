import dbPool from '../db.js';

class CommentRepository {
  constructor(dbPool) {
    this.pool = dbPool;
  }

  async createComment(tripId, userId, body) {
    const client = await this.pool.connect();
    try {
      const insertQuery = `
                INSERT INTO comments (trip_id, user_id, body) VALUES ($1, $2, $3);
                `;
      await client.query(insertQuery, [tripId, userId, body]);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      client.release();
    }

  }

  async deleteComment(commentId, commentOwner, userId) {
    const client = await this.pool.connect();
    try {
      const deleteQuery = `
                DELETE FROM comments WHERE id = $1;
                `;
      if (commentOwner != userId) return null;
      await client.query(deleteQuery, [commentId]);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      client.release();
    }

  }

  async getComments(tripId) {
    const client = await this.pool.connect();
    try {
      const selectQuery = `
                SELECT * FROM comments WHERE trip_id = $1;
                `;
      const result = await client.query(selectQuery, [tripId]);
      return result.rows;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      client.release();
    }

  }

  async editComment(commentId, commentOwner, userId, body) {
    const client = await this.pool.connect();
    try {
      const updateQuery = `
                UPDATE comments SET body = $1 WHERE id = $2;
                `;
      if (commentOwner !== userId) return null;
      await client.query(updateQuery, [body, commentId]);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      client.release();
    }

  }


}

export default new CommentRepository(dbPool);
