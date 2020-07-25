const express = require('express');
const dashboard = require('./dashboard');
const team = require('./team');
const message = require('./message');
const { authorisedPages } = require('../../Middleware/auth');

const role = 'ROL-EMPLOYER';

const router = express.Router();
router.use('/dashboard', authorisedPages(role),  dashboard);
router.use('/', authorisedPages(role), team);
router.use('/message', authorisedPages(role), message);

module.exports = router;
