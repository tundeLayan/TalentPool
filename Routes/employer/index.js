const express = require('express');
const dashboard = require('./dashboard');
const team = require('./team');
const message = require('./message');
const employerProfileCrud = require('./employerProfileCrud');
const { authorisedPages } = require('../../Middleware/auth');

const role = 'ROL-EMPLOYER';

const router = express.Router();
router.use('/dashboard', authorisedPages(role), dashboard);
router.use('/profile', authorisedPages(role), employerProfileCrud);
router.use('/message', authorisedPages(role), message);
router.use('/', authorisedPages(role), team);

module.exports = router;
