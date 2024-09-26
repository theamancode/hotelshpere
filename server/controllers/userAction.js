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
    }
};

module.exports = userAction;