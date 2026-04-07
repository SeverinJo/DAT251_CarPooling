CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    address_name VARCHAR(255),
    number INTEGER,
    letter CHAR(1),
    municipality VARCHAR(255),
    city VARCHAR(255),
    postal_code CHAR(4),
    epsg VARCHAR(16),
    latitude NUMERIC(10,7),
    longitude NUMERIC(11,7)
);

CREATE TABLE trips (
   id SERIAL PRIMARY KEY,
   driver_id INTEGER NOT NULL,
   origin INTEGER NOT NULL,
   origin_municipality VARCHAR(255) NOT NULL,
   destination INTEGER NOT NULL,
   departure_time TIMESTAMP NOT NULL,
   seats_available INT NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

   CONSTRAINT fk_driver
        FOREIGN KEY (driver_id)
            REFERENCES users(id)
            ON DELETE CASCADE,

   CONSTRAINT fk_trip_origin_address
        FOREIGN KEY (origin)
            REFERENCES addresses(id),

   CONSTRAINT fk_trip_destination_address
        FOREIGN KEY (destination)
            REFERENCES addresses(id)
);

CREATE INDEX idx_trips_driver_id ON trips(driver_id);
CREATE INDEX idx_trips_origin ON trips(origin);
CREATE INDEX idx_trips_origin_municipality ON trips(origin_municipality);
CREATE INDEX idx_trips_destination ON trips(destination);

CREATE TYPE participant_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE trip_participants (
   id SERIAL PRIMARY KEY,
   trip_id INTEGER NOT NULL,
   user_id INTEGER NOT NULL,
   status participant_status NOT NULL DEFAULT 'PENDING',
   requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP,

   CONSTRAINT fk_trip
       FOREIGN KEY (trip_id)
           REFERENCES trips(id)
           ON DELETE CASCADE,

   CONSTRAINT fk_user
       FOREIGN KEY (user_id)
           REFERENCES users(id)
           ON DELETE CASCADE,

   CONSTRAINT unique_trip_user UNIQUE (trip_id, user_id)
);

CREATE INDEX idx_trip_participants_trip_id ON trip_participants(trip_id);
CREATE INDEX idx_trip_participants_user_id ON trip_participants(user_id);

-- Addresses lookup indexes (tune later based on actual query patterns).
CREATE INDEX idx_addresses_postal_code ON addresses(postal_code);
CREATE INDEX idx_addresses_municipality ON addresses(municipality);
CREATE INDEX idx_addresses_city ON addresses(city);
CREATE INDEX idx_addresses_name_number_letter ON addresses(address_name, number, letter);
