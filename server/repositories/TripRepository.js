import dbPool from '../db.js';
import { signJwt } from '../utils/jwtUtils.js';

class TripRepository {
    constructor(dbPool){
        this.pool = dbPool;
    }
    async createTrip(userId, title){
        const tripStatus = await this.checkCurrentTripStatus(userId);
        console.log(tripStatus);
        if (tripStatus === 'open') return 'open';
        const client = await this.pool.connect();
        const insertQuery = `INSERT INTO trips (user_id, title) VALUES ($1, $2) RETURNING id`;
        const trip = await client.query(insertQuery, [userId, title]);
        const token = await signJwt(trip.rows[0].id);
        return token;
    }

    async checkCurrentTripStatus(userId){
        const client = await this.pool.connect();
        try{
            const searchQuery = `SELECT status FROM trips WHERE user_id = $1 
            ORDER BY created_at DESC`;
            const searchResult = await client.query(searchQuery, [userId]);
            const tripStatus =  searchResult.rows[0].status;
            return tripStatus;
            } catch(err){
                console.error(err);
                throw err;
            } finally {
                client.release();
            }

    }
    
    async endCurrentTrip(userId){
        const client = await this.pool.connect();
        const tripStatus = await this.checkCurrentTripStatus(userId);
            try{
                if(tripStatus === 'open'){
                    const updateQuery = `UPDATE trips SET status = 'closed' 
                    WHERE user_id = $1 AND status = 'open'`;
                    const updateResult = await client.query(updateQuery, [userId]);
                } else if(tripStatus === 'closed'){
                    return 'closed';
                }
            } catch(err){
                console.error(err);
                throw err;
            } finally {
                client.release();
            }
    }
}

export default new TripRepository(dbPool);
