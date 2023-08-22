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

    async generateToken(id) {
        return new Promise((resolve, reject) => {
            const secretKey = process.env.JWT_SECRET_KEY;
            const expiresIn = process.env.JWT_EXPIRES_IN;
            jwt.sign({id}, secretKey, {expiresIn}, (err, token) => {
                if(err) {
                    reject(err);
                } else {
                    console.log('Token signed!');
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

            const userInsertQuery = `INSERT INTO users (email, fullname, password, username)
            VALUES ($1, $2, $3, $4)
            RETURNING id, email`;
            
            const values = [email, fullname, hashedPassword, username];

            const userInsertResult = await  this.pool.query(userInsertQuery, values);
            const userId = userInsertResult.rows[0].id;

            const usernameInsertQuery = `INSERT INTO usernames (user_id, username) VALUES ($1, $2)`;
            const usernameInsertResult  = await client.query(usernameInsertQuery, [userId, username]);

            await client.query('COMMIT')

            const secretKey = process.env.JWT_SECRET_KEY;
            const expiresIn = process.env.JWT_EXPIRES_IN; 
            const token = await this.generateToken(userId, secretKey, expiresIn);

            return token;
            
        } catch (err){
            await client.query('ROLLBACK')
            console.error(err);
            throw err;
        } finally {
            client.release();
        }
    }

    async findUserByEmailOrUsername(input, string) {
        const client = await this.pool.connect();
        try {
            const searchQuery = `SELECT * FROM users WHERE ${string} = $1 `;
            const user = await client.query(searchQuery, [input] );
            return user;
        } catch(err) {
            console.error(err);
            throw err;
        } finally {
            client.release();
        }
    } 

    async verifyPassword(user, password) {
        if (!user || !user.rows || user.rows.length === 0) {
            return false;
        }
        const hashedPassword = user.rows[0].password;
        const match = await bcrypt.compare(password, hashedPassword)
        return match;
    }

    async login(input, password) {
        try {
            let user;
            if(input.includes('@')) {
                user = await this.findUserByEmailOrUsername(input, 'email');
            } else {
                user = await this.findUserByEmailOrUsername(input, 'username');
            }
            if(user && await this.verifyPassword(user, password)) {
                const token = await this.generateToken(user.rows[0].id);
                console.log(token);
                return token;
             } else {
                 return null;
             }
        } catch(err){
            throw err;
        }
    }
};

export default new AuthRepository(dbPool);

