exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        ALTER TABLE trips ADD COLUMN description VARCHAR(300);
        ALTER TABLE trips ALTER COLUMN description SET NOT NULL;

        ALTER TABLE trips ADD COLUMN url VARCHAR(300);
        ALTER TABLE trips ALTER COLUMN url SET NOT NULL;
    `);
};

exports.down = pgm => {
    pgm.sql(`
        
        ALTER TABLE trips ALTER COLUMN description DROP NOT NULL;
        ALTER TABLE trips DROP COLUMN description;

        ALTER TABLE trips ALTER COLUMN url DROP NOT NULL;
        ALTER TABLE trips DROP COLUMN url;
    `);
};


