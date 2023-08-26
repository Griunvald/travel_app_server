
exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        CREATE TABLE tags (
          id SERIAL PRIMARY KEY,
          tag_name VARCHAR(50) NOT NULL UNIQUE
        );

        CREATE TABLE record_tags (
          record_id INTEGER REFERENCES records(id),
          tag_id INTEGER REFERENCES tags(id),
          PRIMARY KEY (record_id, tag_id)
          );
    `);
};

exports.down = pgm => {
    pgm.sql(`
        DROP TABLE tags;

        DROP TABLE record_tags;
    `);
};


