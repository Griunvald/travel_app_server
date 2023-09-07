import dbPool from '../db.js';

class TagRepository {
    constructor(dbPool){
        this.pool = dbPool;
    }

        async insertTags(tags){
            const client = await this.pool.connect();
            try {
                const insertQuery = `
                INSERT INTO tags (tag_name) SELECT unnest($1::varchar[])
                ON CONFLICT (tag_name) DO NOTHING;
                `;

                await client.query(insertQuery, [tags])
            } catch(err){
                console.error(err);
                throw err;
            } finally {
                client.release();
            }

        }    

        async getTagIdsByNames(tagNames){
            const client = await this.pool.connect();
            try {
                const selectQuery = `
                SELECT id FROM tags WHERE tag_name = ANY($1::varchar[]);
                `;

                const result = await client.query(selectQuery, [tagNames]);
                const tagIds = result.rows.map(row => row.id);
                return tagIds;
            } catch(err){
                console.error(err);
                throw err;
            } finally {
                client.release();
            }
        }


        async removeTagFromRecord(recordId, tagId){
            const client = await this.pool.connect();
            try {
                const deleteQuery = `
                DELETE FROM record_tags 
                WHERE record_id = $1 AND tag_id = $2;
                `;
                await client.query(deleteQuery, [recordId, tagId]);
            } catch(err){
                console.error(err);
                throw err;
            } finally {
                client.release();
            }
        }


        // async addTagToRecord(recordId, tagId){
        //     const client = await this.pool.connect();
        //     try {
        //         await client.query();
        //     } catch(err){
        //         console.error(err);
        //         throw err;
        //     } finally {
        //         client.release();
        //     }
        // }
}

export default new TagRepository(dbPool);
