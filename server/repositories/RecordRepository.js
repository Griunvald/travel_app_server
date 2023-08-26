import dbPool from '../db.js';

class RecordRepository {
    constructor(dbPool){
        this.pool = dbPool;
    }
    
    async createRecord(userId, tripId, type, data){
        const client = await this.pool.connect();
           try{
                const searchQuery = `SELECT COALESCE(MAX(order_number), 0) AS max_number
                FROM records WHERE trip_id = $1`;
                const insertQuery = `INSERT INTO records (user_id, trip_id, type, order_number)
                VALUES ($1, $2, $3, $4)`;
                const selectResult = await client.query(searchQuery, [tripId]);
                const orderNumber = selectResult.rows[0].max_number + 1;
                const insertResult = await client.query(insertQuery, [userId, tripId, type, orderNumber]);
                if(type === 'text'){
                    const insertTextQuery =`INSERT INTO text_records (id, text_value) VALUES ($1, $2)`;
                   client.query(insertTextQuery, [orderNumber, data]);
                } else if (type === 'url'){
                    const insertUrlQuery =`INSERT INTO url_records (id, url_value) VALUES ($1, $2)`;
                   client.query(insertUrlQuery, [orderNumber, data]);
                }
            } catch(err){
                console.error(err);
                throw err;
            } finally {
                client.release();
            }
    }

}
export default new RecordRepository(dbPool);

