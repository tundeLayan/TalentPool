const express = require('express');
const { dashboard } = require('../../Controllers/employer/dashboard');

const router = express.Router();

/* GET users listing. */
router.get('/dashboard', dashboard);

module.exports = router;
