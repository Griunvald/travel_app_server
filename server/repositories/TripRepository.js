import dbPool from '../db.js';
import { signJwt } from '../utils/jwtUtils.js';

class TripRepository {
    constructor(dbPool){
        this.pool = dbPool;
    }
    async createTrip(userId, username, title, description, url){
        const tripStatus = await this.checkCurrentTripStatus(userId);
        console.log(tripStatus);
        if (tripStatus === 'open') return 'open';
        const client = await this.pool.connect();
        const insertQuery = `INSERT INTO trips (user_id, title, description, url) VALUES ($1, $2, $3, $4) RETURNING id`;
        const trip = await client.query(insertQuery, [userId, title, description, url]);
        const tripId = JSON.stringify({tripId: trip.rows[0].id});
        return tripId;
    }

    async checkCurrentTripStatus(userId){
        const client = await this.pool.connect();
        try{
            const searchQuery = `SELECT status FROM trips WHERE user_id = $1 
            ORDER BY created_at DESC`;
            const searchResult = await client.query(searchQuery, [userId]);
               if (searchResult.rows.length === 0) {
              return null;
            }
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

    async getCurrentTrip(userId){
        const client = await this.pool.connect();
        try{
            const searchQuery = `SELECT id, title, description, url, created_at FROM trips WHERE user_id = $1 
            ORDER BY created_at DESC LIMIT 1`;
            const searchResult = await client.query(searchQuery, [userId]);
            if(searchResult.rows.length > 0){
                const { id, title, description, url, created_at: createdAt } =  searchResult.rows[0];
                return { id, title, description, url, createdAt };
            }
        } catch(err){
            console.error(err);
            throw err;
        } finally {
            client.release();
        }
    }

    async getAllTripsPreview(){

        const client = await this.pool.connect();
        try{
            const searchQuery = `SELECT trips.id, usernames.username, trips.title, trips.description, trips.url, trips.created_at FROM trips
            JOIN usernames ON trips.user_id = usernames.user_id ORDER BY created_at DESC`;
            const searchResult = await client.query(searchQuery);
            const results = [];

            for (const row of searchResult.rows) {
              const { id, username, title, description, url, created_at: createdAt } = row;
              results.push({ id, username, title, description, url, createdAt });
            }

            return results;
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
            const selectQuery = `
            WITH RecordTags AS (
  SELECT rt.record_id, t.id AS tag_id, t.tag_name
  FROM record_tags rt
  JOIN tags t ON rt.tag_id = t.id
)

SELECT
  r.*,
  tr.text_value,
  ur.url_value,
  (
    SELECT JSON_AGG(json_build_object('id', rt.tag_id, 'tag_name', rt.tag_name))
    FROM RecordTags rt
    WHERE rt.record_id = r.id
  ) AS record_tags
FROM records r
LEFT JOIN text_records tr ON r.id = tr.id AND r.type = 'text'
LEFT JOIN url_records ur ON r.id = ur.id AND r.type = 'url'
WHERE r.user_id = $1 AND r.trip_id = $2
AND (tr.text_value IS NOT NULL OR ur.url_value IS NOT NULL)
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
