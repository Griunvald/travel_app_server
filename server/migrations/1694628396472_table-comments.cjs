

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        CREATE TABLE comments (
            id SERIAL PRIMARY KEY,
            trip_id INTEGER REFERENCES trips(id),
            user_id INTEGER REFERENCES users(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            edited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            body VARCHAR(500)
        );
    `);
};

exports.down = pgm => {
    pgm.sql(`
        DROP TABLE comments;
    `);
};

