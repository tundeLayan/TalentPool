const express = require('express');
const dashboard = require('./dashboard');
const team = require('./team');
const message = require('./message');

const router = express.Router();
router.use('/dashboard', dashboard);
router.use('/', team);
router.use('/message', message);

module.exports = router;
