import dbPool from '../db.js';

class RecordRepository {
    constructor(dbPool){
        this.pool = dbPool;
    }
    
    async createRecord(userId, tripId, type){
        const client = await this.pool.connect();
           try{
                const searchQuery = `SELECT COALESCE(MAX(order_number), 0) AS max_number
                FROM records WHERE trip_id = $1`;
                const insertQuery = `INSERT INTO records (user_id, trip_id, type, order_number)
                VALUES ($1, $2, $3, $4)`;
                const selectResult = await client.query(searchQuery, [tripId]);
                const orderNumber = selectResult.rows[0].max_number + 1;
                const insertResult = await client.query(insertQuery, [userId, tripId, type, orderNumber]);
               console.log(insertResult.rows[0]);
            } catch(err){
                console.error(err);
                throw err;
            } finally {
                client.release();
            }
    }

}
export default new RecordRepository(dbPool);

