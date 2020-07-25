const express = require('express');
const dashboard = require('./dashboard');
const team = require('./team');
const employerProfileCrud = require('./employerProfileCrud');

const router = express.Router();
router.use('/', dashboard);
router.use('/', team);
router.use('/', employerProfileCrud);

module.exports = router;
