
exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        CREATE TABLE trips (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          user_id INTEGER REFERENCES users(id),
          title VARCHAR(100) NOT NULL,
          CONSTRAINT unique_user_trip_title UNIQUE (user_id, title)
        );
    `);
};

exports.down = pgm => {
    pgm.sql(`
        DROP TABLE trips;
    `);
};

