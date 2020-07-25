const express = require('express');
const dashboard = require('./dashboard');
const team = require('./team');
const message = require('./message');
const { authorisedPages } = require('../../Middleware/auth');

const router = express.Router();
router.use('/dashboard', authorisedPages,  dashboard);
router.use('/', authorisedPages, team);
router.use('/message', authorisedPages, message);

module.exports = router;
