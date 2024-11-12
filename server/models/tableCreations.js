const db = require('../config/db')

const createHotleSphereTables = () => {
    // Create User Table
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS hs_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    db.query(createUsersTable, (err, result) => {
        if(err) {
            console.log('Error creating hs_users table', err.message);
            return;
        }
    });

    // Create User Meta Table
    const createUsersMetaTable = `
        CREATE TABLE IF NOT EXISTS hs_users_meta (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(20) NOT NULL,
            meta_key VARCHAR(100) NOT NULL,
            meta_value VARCHAR(100) NOT NULL
        )
    `;
    db.query(createUsersMetaTable, (err, result) => {
        if(err) {
            console.log('Error creating hs_users_meta table', err.message);
            return;
        }
    });

    // Create Hotel registration
    const createHotelRegistrationTable = `
        CREATE TABLE IF NOT EXISTS hs_hotel_registrations (
            hotel_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            owner_name VARCHAR(100),
            email VARCHAR(100) NOT NULL,
            phone_number VARCHAR(15),
            address TEXT,
            latitude DECIMAL(10, 6),
            longitude DECIMAL(10, 6),
            city_id INT,
            state VARCHAR(50),
            country VARCHAR(50),
            postal_code VARCHAR(10),
            star_rating TINYINT(1),
            check_in_time TIME,
            check_out_time TIME,
            status ENUM('active', 'inactive', 'under_review') DEFAULT 'inactive',
            description TEXT,
            logo_url VARCHAR(255),
            registration_date DATETIME,
            verified BOOLEAN DEFAULT FALSE,
            reviews_count INT DEFAULT 0,
            average_review_rating DECIMAL(3, 2) DEFAULT 0.00,
            tax_id VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (city_id) REFERENCES hs_allowed_cities(city_id)
        );
    `;
    db.query(createHotelRegistrationTable, (err, result) => {
        if(err) {
            console.log(err.message);
            return;
        }
    });

    // Create City table
    const createCityTable = `
        CREATE TABLE IF NOT EXISTS hs_allowed_cities (
            city_id INT AUTO_INCREMENT PRIMARY KEY, 
            city_name VARCHAR(100) NOT NULL,
            state VARCHAR(100),
            country VARCHAR(100) NOT NULL,
            postal_code VARCHAR(10),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    db.query(createCityTable, (err, result) => {
        if(err) {
            console.log('Error creating hs_allowed_cities table', err.message);
            return;
        }
    });

    // Create Amenities Table
    const createAmenitiesTable = `
        CREATE TABLE IF NOT EXISTS hs_hotel_amenities (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            hotel_id INT(20) NOT NULL,
            amenities JSON
        );
    `;
    db.query(createAmenitiesTable, (err, result) => {
        if(err) {
            console.log('Error Creating hs_hotel_amenities table', err.message);
            return;
        }
    });

    // Create Amenities Table
    const createRoomTypeTable = `
        CREATE TABLE IF NOT EXISTS hs_hotel_room_types (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            hotel_id INT(20) NOT NULL, 
            room_data JSON
        );
    `;
    db.query(createRoomTypeTable, (err, result) => {
        if(err) {
            console.log('Error Creating hs_hotel_amenities table', err.message);
            return;
        }
    });
}

// Export the function to be used in everywhere
module.exports = { createHotleSphereTables };