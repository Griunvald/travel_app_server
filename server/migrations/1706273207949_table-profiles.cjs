exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        CREATE TYPE user_gender AS ENUM ('Male', 'Female', 'Alien', 'Prefer not to say');

        CREATE TABLE profiles (
        user_id INTEGER PRIMARY KEY,
        about VARCHAR(500),
        avatar VARCHAR(200),
        country VARCHAR(50),
        home_town VARCHAR(50),
        gender user_gender,
        FOREIGN KEY (user_id) REFERENCES users(id)
        );

    `);
};

exports.down = pgm => {
    pgm.sql(`
        DROP TABLE profiles;
        DROP TYPE user_gender;
    `);
};
