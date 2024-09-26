const express = require('express');
const router = express.Router();
const userAction = require('../controllers/userAction');

// Route for Create or Insert User data
router.post('/create-user', userAction.createUserAction);

// Route for update user data
router.put('/update-user', userAction.updateUserAction)

// Route for delete user data
router.put('/delete-user', userAction.delteUserAction)

module.exports = router;