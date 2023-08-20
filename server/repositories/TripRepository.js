import dbPool from '../db.js';

class TripRepository {
    constructor(dbPool){
        this.pool = dbPool;
    }
    async createTrip(userId, title){
        const client = await this.pool.connect();
        const insertQuery = `INSERT INTO trips (user_id, title) VALUES ($1, $2)`;
        const trip = await client.query(insertQuery, [userId, title]);
    }
}

export default new TripRepository(dbPool);
