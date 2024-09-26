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
        console.log('hs_users table created or already exists');
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
        console.log('hs_users_meta table created or already exists');
    });
}

// Export the function to be used in everywhere
module.exports = { createHotleSphereTables };