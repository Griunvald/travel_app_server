import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

(async () => {
        const client = await pool.connect();
    try {
        const result = await client.query('SELECT current_database()');
        console.log(`Connected to the database ${result.rows[0].current_database}`);
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
    }
    
})();

export default pool;
