exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        ALTER TABLE trips ALTER COLUMN username DROP NOT NULL;
        ALTER TABLE trips DROP COLUMN username;
    `);
};

exports.down = pgm => {
    pgm.sql(`
        ALTER TABLE trips ADD COLUMN username VARCHAR(50);
        ALTER TABLE trips ALTER COLUMN username SET NOT NULL;
    `);
};


