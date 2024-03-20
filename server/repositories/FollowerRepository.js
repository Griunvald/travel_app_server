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

        async unfollowUser(leaderId, followerId){
            const client = await this.pool.connect();
            try {
                const deleteQuery = `DELETE FROM followers WHERE leader_id = $1 
                AND follower_id = $2`;
                await client.query(deleteQuery, [leaderId, followerId]);
            } catch(err){
                console.error(err);
                throw err;
            } finally {
                client.release();
            }

        }    

        async getFollowers(userId){
            const client = await this.pool.connect();
            try {
                const selectQuery = `SELECT username FROM followers JOIN 
                usernames ON follower_id = usernames.user_id WHERE followers.leader_id = $1`;
                const result = await client.query(selectQuery, [userId]);
                console.log(result.rows);
            } catch(err){
                console.error(err);
                throw err;
            } finally {
                client.release();
            }

        }    

        async getFollowing(userId) {
            const client = await this.pool.connect();
            try {
                const selectQuery = `
                    SELECT usernames.user_id AS following_user_id
                    FROM followers
                    JOIN usernames ON followers.leader_id = usernames.user_id
                    WHERE followers.follower_id = $1;
                `;

                const result = await client.query(selectQuery, [userId]);
                
                const followingData = {
                    userId: userId,
                    followingUsersIds: result.rows.map(row => row.following_user_id) 
                };
                return followingData;
            } catch(err) {
                console.error(err);
                throw err;
            } finally {
                client.release();
            }
        }
}

export default new FollowerRepository(dbPool);
