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
               if (searchResult.rows.length === 0) {
              return null;
            }
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

    async getCurrentTrip(userId){
        const client = await this.pool.connect();
        try{
            const searchQuery = `SELECT id, title, created_at FROM trips WHERE user_id = $1 
            ORDER BY created_at DESC LIMIT 1`;
            const searchResult = await client.query(searchQuery, [userId]);
            const { id, title, created_at: createdAt } =  searchResult.rows[0];
            return { id, title, createdAt };
        } catch(err){
            console.error(err);
            throw err;
        } finally {
            client.release();
        }
    }


    async getCurrentTripRecordsWithTags(userId){
        const client = await this.pool.connect();
        try{
            const { id: tripId } = await this.getCurrentTrip(userId);
            console.log("tripId is: ", tripId);
            console.log("userId is: ", userId);
            const selectQuery = `
                WITH RecordTags AS (
                SELECT rt.record_id, ARRAY_AGG(t.tag_name) AS record_tags
                FROM record_tags rt
                JOIN tags t ON rt.tag_id = t.id
                GROUP BY rt.record_id
            )

                SELECT r.*, tr.text_value, ur.url_value, trr.record_tags AS
                text_record_tags, urr.record_tags AS url_record_tags
                FROM records r
                LEFT JOIN text_records tr ON r.id = tr.id
                LEFT JOIN url_records ur ON r.id = ur.id
                LEFT JOIN RecordTags trr ON r.id = trr.record_id
                LEFT JOIN RecordTags urr ON r.id = urr.record_id
                WHERE r.user_id = $1 AND r.trip_id = $2
                ORDER BY r.order_number ASC;
        `;
            const result = await client.query(selectQuery, [userId, tripId]);
            return result;
        } catch(err){
            console.error(err);
            throw err;
        } finally {
            client.release();
        }
    }
}

export default new TripRepository(dbPool);
