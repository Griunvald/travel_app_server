import dbPool from '../db.js';
import bcrypt from 'bcrypt';
import { signJwt, verifyJwt } from '../utils/jwtUtils.js';
import cookieParser from 'cookie-parser';
import ProfileRepository from './ProfileRepository.js';

class AuthRepository {
  constructor(dbPool) {
    this.pool = dbPool;
  }

  async hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async generateToken(id) {
    const token = await signJwt({ id });
    return token;
  }

  async createUser(email, fullname, username, password) {
    const client = await this.pool.connect();
    try {
      await client.query(`BEGIN`);

      const usernameSelectQuery = `SELECT id FROM usernames WHERE username = $1`;
      const usernameSelectResult = await client.query(usernameSelectQuery, [username]);

      if (usernameSelectResult.rows.length > 0) {
        throw new Error('Username already taken!');
      }

      const hashedPassword = await this.hashPassword(password);

      const userInsertQuery = `INSERT INTO users (email, fullname, password, username)
            VALUES ($1, $2, $3, $4)
            RETURNING id, email, username`;

      const values = [email, fullname, hashedPassword, username];

      const userInsertResult = await this.pool.query(userInsertQuery, values);
      const userId = userInsertResult.rows[0].id;
      const userInfo = JSON.stringify({ username: userInsertResult.rows[0].username, userId });

      const usernameInsertQuery = `INSERT INTO usernames (user_id, username) VALUES ($1, $2)`;
      const usernameInsertResult = await client.query(usernameInsertQuery, [userId, username]);

      await client.query('COMMIT')

      const token = await this.generateToken(userId);

      return { token, userInfo };

    } catch (err) {
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
      const user = await client.query(searchQuery, [input]);
      return user;
    } catch (err) {
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
      if (input.includes('@')) {
        user = await this.findUserByEmailOrUsername(input, 'email');
      } else {
        user = await this.findUserByEmailOrUsername(input, 'username');
      }
      if (user && await this.verifyPassword(user, password)) {
        const token = await this.generateToken(user.rows[0].id);
        const profile = await ProfileRepository.getProfile(user.rows[0].id);
        const userInfo = JSON.stringify({
          username: user.rows[0].username,
          userId: user.rows[0].id,
          avatar: profile.avatar || ''
        });
        return { token, userInfo };
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  async getUserIdFromToken(token) {
    const decodedToken = await verifyJwt(token);
    const userId = decodedToken.userId;
    return userId;

  }


};

export default new AuthRepository(dbPool);

