exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        CREATE TABLE usernames (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          username VARCHAR(50) UNIQUE NOT NULL
        );
    `);
};

exports.down = pgm => {
    pgm.sql(`
        DROP TABLE usernames; 
        `);
};

