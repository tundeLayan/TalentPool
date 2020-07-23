const express = require('express');
const { dashboard } = require('../../Controllers/employer/dashboard');

const router = express.Router();

/* GET Dashboard. */
router.get('/', dashboard);

module.exports = router;
