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
                VALUES ($1, $2, $3, $4) RETURNING id`;
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
               const recordId = insertResult.rows[0].id;
               console.log("Record id is: ", recordId);
               return recordId;
            } catch(err){
                console.error(err);
                throw err;
            } finally {
                client.release();
            }
    }
    
    async associateTagsWithRecord(recordId, tagIds){
        const client = await this.pool.connect();
        try{
            const insertQuery = `INSERT INTO record_tags(record_id, tag_id) 
            VALUES ($1, unnest($2::integer[]))`;
            await client.query(insertQuery, [recordId, tagIds]);
           } catch(err){
                console.error(err);
                throw err;
            } finally {
                client.release();
            }
    }

    async editTextRecord(textRecordId, textValue){
        const client = await this.pool.connect();
        try{
            const updateQuery = `UPDATE text_records SET text_value = $1 WHERE id = $2`;
            await client.query(updateQuery, [textValue, textRecordId]);
           } catch(err){
                console.error(err);
                throw err;
            } finally {
                client.release();
            }

    }

}
export default new RecordRepository(dbPool);

