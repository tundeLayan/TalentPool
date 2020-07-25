const express = require('express');
const { employerMessagePage } = require('../../Controllers/message/message');

const router = express.Router();

router.get('/', employerMessagePage);

module.exports = router;
