const userDbAction = require('../models/userDbAction');

// All User Action perform here
const userAction = {

    // Create Or Insert User into Database
    createUserAction: (req, res) => {
        const userReqBody = req.body;
        userDbAction.createUser(userReqBody, (err, result) => {
            if (err) {
                res.status(500).json({message: 'Error creating user', error: err});
            } else {
                res.status(200).json({message: 'User created Successfully', data: result});
            }
        });
    },

    // Update User Data
    updateUserAction: (req, res) => {
        const updateReqBody = req.body;
        userDbAction.editUserData(updateReqBody, (err, result) => {
            if (err) {
                res.status(500).json({message: 'Error Updating user', error: err});
            } else {
                res.status(200).json({message: 'User data updated Successfully', data: result});
            }
        })
    },

    // Delete User Data
    delteUserAction: (req, res) => {
        const deleteReqBody = req.body;
        userDbAction.deleteUserData(deleteReqBody, (err, result) => {
            if (err) {
                res.status(500).json({message: 'Error updating user', error: err});
            } else {
                res.status(200).json({message: 'User Deleted successfully', data: result})
            }
        })
    },

    // User Login
    userLoginAction: (req, res) => {
        const credentials = req.body;
        userDbAction.userLogin(credentials, (err, result) => {
            if (err) {
                if (err.success == false) {
                    res.status(401).json({success: false, message: "Invalid Username/Email Or Password"});
                } else {
                    res.status(500).json({success: false, message: "An error occured duing login", error: err});
                }
            }

            // Success -user logged In
            return res.status(200).json({
                success: true,
                message: "Login Successfully",
                data: result // send user data for keep logged in
            })
        });
    },

    // Fetched User profile
    userDetailsAction: (req, res) => {
        const user_id = req.params.userId;
        userDbAction.getUserProfile({id: user_id}, (err, result) => {
            if (err) {
                res.status(500).json({message: 'Error fetching user data', error: err});
            } else {
                res.status(200).json({message: 'User data fetched successfully', data: result})
            }
        });
    },

    // Update User Password
    updatePasswordAction: (req, res) => {
        const reqdata = req.body;
        userDbAction.updateUserPassword(reqdata, (err, result) => {
            if (err) {
                res.status(500).json({message: 'Error updating user password', error: err});
            } else {
                res.status(200).json({message: 'User password updated successfully', data: result});
            }
        });
    }
};

module.exports = userAction;