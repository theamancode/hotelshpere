const db = require("../config/db")

// Create Global function main function
const globalDbAction = {
    // Global function for add / update User Metadata
    updateUserMeta: (user_id, meta_key, meta_value, callback) => {
        const sql = `INSERT INTO hs_users_meta (user_id, meta_key, meta_value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE meta_value = ?`;

        // Executing the query
        db.query(sql, [user_id, meta_key, meta_value, meta_value], (err, result) => {
            if(err) {
                console.error("Error Upserting user meta data: ", err);
                return callback(err, null);  // Send the error to the controller
            } else {
                console.log(`User meta data upserted for userId: ${user_id}, metaKey: ${meta_key}`);
            return callback(null, result);  // Send the result to the controller
            }
        });
    },

    deleteUserMeta: (user_id, meta_key, callback) => {
        const sql = `DELETE FROM hs_users_meta WHERE user_id = ? AND meta_key = ?`;

        // Executing the query
        db.query(sql, [user_id, meta_key], (err, result) => {
            if (err) {
                console.error("Error deleting user meta key: "+ err);
                return callback(err, null);
            } else {
                console.log(`User meta deleted for userId: ${user_id}, metaKey: ${meta_key}`);
                return callback(null, result);  // Send the result to the controller
            }
        });
    }
}

module.exports = globalDbAction;