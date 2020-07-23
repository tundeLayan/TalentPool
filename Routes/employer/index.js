const express = require('express');
const dashboard = require('./dashboard');

const router = express.Router();
router.use('/dashboard', dashboard);

module.exports = router;
