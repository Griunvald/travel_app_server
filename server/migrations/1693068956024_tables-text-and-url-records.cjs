exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        CREATE TYPE record_status AS ENUM ('draft', 'published');

        CREATE TABLE text_records (
          id INTEGER PRIMARY KEY REFERENCES records(id),
          text_value TEXT,
          tags TEXT[] DEFAULT '{}',
          status record_status DEFAULT 'draft'
        );

        CREATE TABLE url_records (
          id INTEGER PRIMARY KEY REFERENCES records(id),
          url_value VARCHAR(200),
          tags TEXT[] DEFAULT '{}',
          status record_status DEFAULT 'draft'
        );
    `);
};

exports.down = pgm => {
    pgm.sql(`
      DROP TYPE record_status;
      
      DROP TABLE text_records;

      DROP TABLE url_records;
    `);
};


