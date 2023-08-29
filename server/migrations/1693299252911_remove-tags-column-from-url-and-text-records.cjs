exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        ALTER TABLE text_records DROP COLUMN tags;
        ALTER TABLE url_records DROP COLUMN tags;
    `);
};

exports.down = pgm => {
    pgm.sql(`
        ALTER TABLE text_records ADD COLUMN tags VARCHAR(50);
        ALTER TABLE url_records ADD COLUMN tags VARCHAR(50);
    `);
};


