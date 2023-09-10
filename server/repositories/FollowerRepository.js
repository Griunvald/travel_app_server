import dbPool from '../db.js';

class FollowerRepository {
    constructor(dbPool){
        this.pool = dbPool;
    }

        async followUser(leaderId, followerId){
            const client = await this.pool.connect();
            try {
                const insertQuery = `INSERT INTO followers (leader_id, follower_id)
                VALUES ($1, $2)`;
                await client.query(insertQuery, [leaderId, followerId]);
            } catch(err){
                console.error(err);
                throw err;
            } finally {
                client.release();
            }

        }    

}

export default new FollowerRepository(dbPool);
