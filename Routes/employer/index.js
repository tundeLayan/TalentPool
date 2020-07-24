const express = require('express');
const dashboard = require('./dashboard');
const team = require('./team');

const router = express.Router();
router.use('/', dashboard);
router.use('/', team);

module.exports = router;
