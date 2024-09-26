const db = require("../config/db")

// Create or Insert User data In Database
const userDbAction = {
    createUser: (userData, callback) => {
        const sql = `INSERT INTO hs_users (username, email, password) VALUES (?, ?, ?)`;

        db.query(sql, [userData.username, userData.email, userData.password], (err, result) => {
            if(err) {
                console.error("Error inserting user: ", err);
                return callback(err, null);  // Send the error to the controller
            } else {
                console.log("User created successfully with ID: ", result.insertId);

                // Update User Meta data
                const user_id = result.insertId;
                if(userData.meta_key && userData.meta_value) {
                    userDbAction.updateUserMeta(user_id, userData.meta_key, userData.meta_value, (metaErr, metaResult) => {
                        if(metaErr) {
                            console.error("Error updating user meta: ", metaErr);
                            return callback(metaErr, null);  // Send the error to the controller   
                        } else {
                            console.log("User meta data added/updated successfully for userId: ", user_id);
                            return callback(null, { userResult: result, metaResult: metaResult });  // Send both user and meta results to the controller
                        }
                    });
                } else {
                    return callback(null, result);  // Send the result to the controller
                }
            }
        });
    },

    // Update User Info
    editUserData: (userData, callback) => {
        const sql = `UPDATE hs_users SET username = ?, email = ? WHERE id=?`;
        db.query(sql, [userData.username, userData.email, userData.id], (err, result) => {
            if(err) {
                console.error("Error updating user: ", err);
                return callback(err, null);  // Send the error to the controller
            } else {
                console.log("User updated successfully");
                return callback(null, result);  // Send the result to the controller
            }
        });
    },

    // Delete User data
    deleteUserData: (userData, callback) => {
        const sql = `DELETE FROM hs_users WHERE id = ?`;
        db.query(sql, [userData.id], (err, result) => {
            if(err) {
                console.error("Error deleting user: ", err);
                return callback(err, null); // Send the error to the controller
            } else {
                console.log("User deleted successfully with ID: ", userData.id);
                return callback(null, result); // Send the error to the controller
            }
        })
    },

    // Global function for add / update User Metadata
    updateUserMeta: (user_id, meta_key, meta_value, callback) => {
        const sql = `INSERT INTO hs_users_meta (user_id, meta_key, meta_value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE meta_value = ?`;

        // Executing the query
        db.query(sql, [user_id, meta_key, meta_value], (err, result) => {
            if(err) {
                console.error("Error Upserting user meta data: ", err);
                return callback(err, null);  // Send the error to the controller
            } else {
                console.log(`User meta data upserted for userId: ${user_id}, metaKey: ${meta_key}`);
            return callback(null, result);  // Send the result to the controller
            }
        });
    }
}
module.exports = userDbAction