const express = require('express');
const dashboard = require('./dashboard');
const profile = require('./profile');
const updateProfile = require('./update-profile');
const message = require('./message');
const { authorisedPages } = require('../../Middleware/auth');

const router = express.Router();

const role ='ROL-EMPLOYEE';

router.use('/', authorisedPages(role), dashboard);
router.use('/', authorisedPages(role), profile);
router.use('/', authorisedPages(role), updateProfile);
router.get('/message', authorisedPages(role), message);

module.exports = router;
