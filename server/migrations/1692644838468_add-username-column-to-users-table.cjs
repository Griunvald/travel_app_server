exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
      ALTER TABLE users ADD COLUMN username VARCHAR(50) UNIQUE NOT NULL;
    `);
};

exports.down = pgm => {
    pgm.sql(`
      ALTER TABLE users DROP COLUMN username;
    `);
};
