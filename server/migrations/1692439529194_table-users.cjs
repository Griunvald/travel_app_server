exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            email VARCHAR(50) UNIQUE NOT NULL,
            fullname VARCHAR(50) NOT NULL,
            password VARCHAR(255) NOT NULL
            );
        `);
};

exports.down = pgm => {
    pgm.sql(`
        DROP TABLE users; 
        `);
};

