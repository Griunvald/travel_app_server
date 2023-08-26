exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        CREATE TYPE value_type AS ENUM ('text', 'url');

        CREATE TABLE records (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          trip_id INTEGER REFERENCES trips(id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          edited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          type value_type NOT NULL,
          order_number INTEGER
        );
    `);
};

exports.down = pgm => {
    pgm.sql(`
        DROP TABLE records;

        DROP TYPE value_type;
    `);
};


