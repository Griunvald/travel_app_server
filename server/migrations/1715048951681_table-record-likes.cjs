exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
        CREATE TABLE record_likes (
          id SERIAL PRIMARY KEY,
          record_id INTEGER REFERENCES records(id) ON DELETE CASCADE,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(record_id, user_id)
        );
    `);
};

exports.down = pgm => {
  pgm.sql(`
        DROP TABLE record_likes;
    `);
};

