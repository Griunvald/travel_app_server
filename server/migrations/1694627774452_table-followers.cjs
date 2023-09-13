exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
      CREATE TABLE followers (
        id SERIAL PRIMARY KEY,
        leader_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        CHECK(leader_id <> follower_id),
        UNIQUE(leader_id, follower_id)
      );
   `);
};

exports.down = pgm => {
    pgm.sql(`
     DROP TABLE followers;
    `);
};

