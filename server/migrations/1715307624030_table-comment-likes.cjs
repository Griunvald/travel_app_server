exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
        CREATE TABLE comment_likes (
          id SERIAL PRIMARY KEY,
          comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(comment_id, user_id)
        );
    `);
};

exports.down = pgm => {
  pgm.sql(`
        DROP TABLE comment_likes;
    `);
};

