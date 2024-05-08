import dbPool from '../db.js';

class LikeRepository {
  constructor(dbPool) {
    this.pool = dbPool;
  }

  async addLike() {
    const client = await this.pool.connect();
    try {
      console.log('Message from Like Repository');
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      client.release();
    }

  }

}

export default new LikeRepository(dbPool);
