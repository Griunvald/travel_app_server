import pg from 'pg';

const Pool = pg.Pool;

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port:process.env.PG_PORT,
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
