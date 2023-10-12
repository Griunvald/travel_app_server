exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
    ALTER TABLE trips ADD COLUMN description VARCHAR(300);
    ALTER TABLE trips ALTER COLUMN description SET NOT NULL;
    ALTER TABLE trips ALTER COLUMN description DROP NOT NULL;
    ALTER TABLE trips DROP COLUMN description;
    `);
};

exports.down = pgm => {
    pgm.sql(`
    ALTER TABLE trips ADD COLUMN url VARCHAR(100);
    ALTER TABLE trips ALTER COLUMN url SET NOT NULL;
    ALTER TABLE trips ALTER COLUMN url DROP NOT NULL;
    ALTER TABLE trips DROP COLUMN url;
    `);
};


