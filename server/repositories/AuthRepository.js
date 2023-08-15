import dbPool from '../db.js';
import bcrypt from 'bcrypt';

class AuthRepository {
    constructor(dbPool){
        this.pool = dbPool;
    }

    async hashPassword(password) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    async createUser(email, fullname, username, password) {
        const client = await this.pool.connect();
        try {
            await client.query(`BEGIN`);

            const usernameSelectQuery = `SELECT id FROM usernames WHERE username = $1`;
            const usernameSelectResult = await client.query(usernameSelectQuery, [username]);

            if(usernameSelectResult.rows.length > 0) {
                throw new Error('Username already taken!');
            }

            const hashedPassword = await this.hashPassword(password);

            const userInsertQuery = `INSERT INTO users (email, fullname, password)
            VALUES ($1, $2, $3)
            RETURNING id`;
            
            const values = [email, fullname, hashedPassword];

            const userInsertResult = await  this.pool.query(userInsertQuery, values);
            const userId = userInsertResult.rows[0].id;

            const usernameInsertQuery = `INSERT INTO usernames (user_id, username) VALUES ($1, $2)`;
            const usernameInsertResult  = await client.query(usernameInsertQuery, [userId, username]);
            console.log(usernameInsertResult);

            await client.query('COMMIT')
        } catch (err){
            await client.query('ROLLBACK')
            console.error(err);
        } finally {
            client.release();
        }
    }
};

export default new AuthRepository(dbPool);

