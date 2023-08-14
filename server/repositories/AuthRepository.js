import dbPool from '../db.js';

class AuthRepository {
    constructor(dbPool){
        this.pool = dbPool;
    }
    async createUser(email, fullname, password) {
        const client = await this.pool.connect();
        try {
            const query = `INSERT INTO users (email, fullname, password)
            VALUES ($1, $2, $3)
            RETURNING id`;
            
            const values = [email, fullname, password];

            const result = await  this.pool.query(query, values);
            return result.rows[0];
        } catch (err){
            console.error(err);
        } finally {
            client.release();
        }
    }
};

export default new AuthRepository(dbPool);

