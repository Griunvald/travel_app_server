import dbPool from '../db.js';

class CommentRepository {
    constructor(dbPool){
        this.pool = dbPool;
    }

        async createComment(tripId, userId, body){
            const client = await this.pool.connect();
            try {
                const insertQuery = `
                INSERT INTO comments (trip_id, user_id, body) VALUES ($1, $2, $3);
                `;
                await client.query(insertQuery, [tripId, userId, body]);
            } catch(err){
                console.error(err);
                throw err;
            } finally {
                client.release();
            }

        }    

}

export default new CommentRepository(dbPool);
