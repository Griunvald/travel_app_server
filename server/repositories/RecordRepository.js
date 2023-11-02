import dbPool from '../db.js';

class RecordRepository {
  async createRecord(userId, tripId, type, data) {
    const client = await dbPool.connect();
    try {
      await client.query('BEGIN');

      const searchQuery = `SELECT COALESCE(MAX(order_number), 0) AS max_number FROM records WHERE trip_id = $1`;
      const selectResult = await client.query(searchQuery, [tripId]);
      const orderNumber = selectResult.rows[0].max_number + 1;

      const insertRecordQuery = `INSERT INTO records (user_id, trip_id, type, order_number)
                                 VALUES ($1, $2, $3, $4) RETURNING id`;
      const insertResult = await client.query(insertRecordQuery, [userId, tripId, type, orderNumber]);
      const recordId = insertResult.rows[0].id;

      if (type === 'text') {
        const insertTextQuery = `INSERT INTO text_records (id, text_value) VALUES ($1, $2)`;
        await client.query(insertTextQuery, [recordId, data]);
      } else if (type === 'url') {
        const insertUrlQuery = `INSERT INTO url_records (id, url_value) VALUES ($1, $2)`;
        await client.query(insertUrlQuery, [recordId, data]);
      }

      await client.query('COMMIT');
      return recordId;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async associateTagsWithRecord(recordId, tagIds) {
    const client = await dbPool.connect();
    try {
      const insertQuery = `INSERT INTO record_tags(record_id, tag_id) 
                           VALUES ($1, unnest($2::integer[]))`;
      await client.query(insertQuery, [recordId, tagIds]);
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
  }

  async editTextRecord(textRecordId, textValue) {
    const client = await dbPool.connect();
    try {
      const updateQuery = `UPDATE text_records SET text_value = $1 WHERE id = $2`;
      await client.query(updateQuery, [textValue, textRecordId]);
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
  }

  async deleteRecord(recordId, type) {
    const client = await dbPool.connect();
    try {
      await client.query('BEGIN');

      const validTypes = ['text', 'url']; // Ensure that only valid types are used to prevent SQL injection
      if (!validTypes.includes(type)) {
        throw new Error('Invalid record type specified');
      }

      const deleteRecordQuery = `DELETE FROM ${type}_records WHERE id = $1`;
      const deleteTagsQuery = `DELETE FROM record_tags WHERE record_id = $1`;

      await client.query(deleteRecordQuery, [recordId]);
      await client.query(deleteTagsQuery, [recordId]);

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

export default new RecordRepository();

