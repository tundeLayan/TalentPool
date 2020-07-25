const express = require('express');
const { updateProfile, getUpdateProfilepage } = require('../../Controllers/employee/employee-edit-profile');
const { route } = require('../auth');

const router = express.Router();

// get update profile page
router.get('/employee/profile/update', getUpdateProfilepage);
// Update Profile
router.patch('/employee/update/profile', updateProfile);;

module.exports = router;
