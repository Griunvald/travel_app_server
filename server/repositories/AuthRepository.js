import dbPool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

class AuthRepository {
    constructor(dbPool){
        this.pool = dbPool;
    }

    async hashPassword(password) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    async generateToken(payload, secretKey, expiresIn) {
        return new Promise((resolve, reject) => {
            jwt.sign({payload}, secretKey, {expiresIn}, (err, token) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        })
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
            RETURNING id, email`;
            
            const values = [email, fullname, hashedPassword];

            const userInsertResult = await  this.pool.query(userInsertQuery, values);
            const userId = userInsertResult.rows[0].id;

            const usernameInsertQuery = `INSERT INTO usernames (user_id, username) VALUES ($1, $2)`;
            const usernameInsertResult  = await client.query(usernameInsertQuery, [userId, username]);

            await client.query('COMMIT')

            const secretKey = process.env.JWT_SECRET_KEY;
            const expiresIn = process.env.JWT_EXPIRES_IN; 
            const token = await this.generateToken(userId, secretKey, expiresIn);
            console.log(token);

            return token;
            
        } catch (err){
            await client.query('ROLLBACK')
            console.error(err);
            throw err;
        } finally {
            client.release();
        }
    }
};

export default new AuthRepository(dbPool);

