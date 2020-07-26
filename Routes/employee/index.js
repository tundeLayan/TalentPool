const express = require('express');
const dashboard = require('./dashboard');
const profile = require('./profile');
const updateProfile = require('./update-profile');
const message = require('./message');
const { authorisedPages } = require('../../Middleware/auth');

const router = express.Router();

const role ='ROL-EMPLOYEE';

router.use('/dashboard', authorisedPages(role), dashboard);
router.use('/profile', profile);
router.use('/update', authorisedPages(role), updateProfile);
router.use('/message', authorisedPages(role), message);

module.exports = router;
