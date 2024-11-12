const db = require("../config/db");
const globalDbAction = require("./globalDbAction");

// Create or Insert User data In Database
const userDbAction = {
    // Create/Insert user data
    createUser: (userData, callback) => {
        // First, check if a user with the same email already exists
        const checkUserSql = `SELECT * FROM hs_users WHERE email = ?`;

        db.query(checkUserSql, [userData.email], (checkErr, checkResult) => {
            if (checkErr) {
                console.error("Error checking user existence: ", checkErr);
                return callback(checkErr, null);  // Send the error to the controller
            }

            if (checkResult.length > 0) {
                // User already exists
                console.log("User already exists with email: ", userData.email);
                return callback({ message: "User already exists with this email." }, null);  // Return error message
            } else {
                // If user does not exist, proceed to create the new user
                const sql = `INSERT INTO hs_users (username, email, password) VALUES (?, ?, ?)`;

                db.query(sql, [userData.username, userData.email, userData.password], (err, result) => {
                    if (err) {
                        console.error("Error inserting user: ", err);
                        return callback(err, null);  // Send the error to the controller
                    } else {
                        console.log("User created successfully with ID: ", result.insertId);

                        // Update User Meta data
                        const user_id = result.insertId;
                        if (userData.meta_key && userData.meta_value) {
                            globalDbAction.updateUserMeta(user_id, userData.meta_key, userData.meta_value, (metaErr, metaResult) => {
                                if (metaErr) {
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

                // Update User Meta data
                const user_id = result.insertId;
                if (userData.meta_key && userData.meta_value) {
                    globalDbAction.updateUserMeta(user_id, userData.meta_key, userData.meta_value, (metaErr, metaResult) => {
                        if (metaErr) {
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

    // Delete User data
    deleteUserData: (userData, callback) => {
        const sql = `DELETE FROM hs_users WHERE id = ?`;
        db.query(sql, [userData.id], (err, result) => {
            if(err) {
                console.error("Error deleting user: ", err);
                return callback(err, null); // Send the error to the controller
            } else {
                console.log("User deleted successfully with ID: ", userData.id);
                
                const user_id = userData.id;
                if(user_id != '' && userData.meta_key) {
                    globalDbAction.deleteUserMeta(user_id, userData.meta_key, (metaErr, metaResult) => {
                        if (metaErr) {
                            console.error("Error deleting user meta: ", metaErr);
                            return callback(metaErr, null);  // Send the error to the controller   
                        } else {
                            console.log("User meta deleted successfully for userId: ", user_id);
                            return callback(null, { userResult: result, metaResult: metaResult });  // Send both user and meta results to the controller
                        }
                    });
                }
            }
        })
    },

    // User Login Model
    userLogin: (userData, callback) => {
        const checkUserSql = `SELECT * FROM hs_users WHERE (email = ? OR username = ?) AND password = ?`;

        // Execute the query, using the same input for both username and email fields
        db.query(checkUserSql, [userData.identifier, userData.identifier, userData.password], (err, result) => {
            if(err) {
                console.log("Error duing user login: ", err);
                return callback(err, null);
            }

            if (result.length > 0) {
                console.log("User logged in successfully");
                return callback(null, result[0]);
            } else {
                // INvalid username/Email or password
                console.log("Invaild Login credentials");
                return callback({success: false, message: "Invalid Username/Email or password"}, null);
            }
        });
    },

    // Fetched User Data for display
    getUserProfile: (userData, callback) => {
        const sql = `SELECT * FROM hs_users WHERE hs_users.id = ?`;

        // Excute the the query, using the user data ID
        db.query(sql, [userData.id], (err, result) => {
            if (err) {
                console.log("Error in fetching user details ", err);
                return callback(err, null);
            } else {
                console.log("User Profile Fetched successfully");
                return callback(null, result);
            }
        });
    },

    // Update User Password
    updateUserPassword: (userData, callback) => {
        const sql = `UPDATE hs_users SET password=? WHERE id = ?`;

        // Excute the query, Using the user data update the password
        db.query(sql, [userData.newpassword, userData.id], (err, result) => {
            if (err) {
                console.log("Error in updating user password", err);
                return callback(err, null);
            } else {
                console.log("User Password Updated sucessfully");
                return callback(null, result);
            }
        });
    }
}
module.exports = userDbAction