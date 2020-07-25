const express = require('express');
const { updateProfile } = require('../../Controllers/employee/employee-edit-profile');

const router = express.Router();

// Update Profile
router.patch('/employee/update/profile', updateProfile);;

module.exports = router;
