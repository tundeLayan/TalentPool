const express = require('express');
const router = express.Router();
const employee = require('./employee');
const admin = require('./admin');

router.use(employee);
router.use(admin);

module.exports = router;