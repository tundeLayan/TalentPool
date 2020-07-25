const express = require('express');
const { employeeMessagePage } = require('../../Controllers/message/message');

const router = express.Router();

router.get('/', employeeMessagePage);

module.exports = router;
