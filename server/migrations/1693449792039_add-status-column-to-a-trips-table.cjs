exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        CREATE TYPE trip_status AS ENUM ('open', 'closed');
        ALTER TABLE trips ADD COLUMN status trip_status DEFAULT 'open';
        
    `);
};

exports.down = pgm => {
    pgm.sql(`
        DROP TYPE trip_status;
        ALTER TABLE trips DROP COLUMN status;
    `);
};

