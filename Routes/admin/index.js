const express = require('express');
const dashboard = require('./dashboard');
const employer = require('./employer');

const router = express.Router();

router.use(dashboard);
router.use(employer);

module.exports = router;