const express = require('express');
const dashboard = require('./dashboard');
const profile = require('./profile');
const updateProfile = require('./update-profile');
const message = require('./message');
// const { authorisedPages } = require('../../Middleware/auth');

const router = express.Router();

router.use('/', dashboard);
router.use('/', profile);
router.use('/', updateProfile);
router.get('/message', message);

module.exports = router;
