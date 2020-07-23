const express = require('express');
const { demo } = require('../Controllers/demo');

const router = express.Router();

/* GET users listing. */
router.get('/', demo);

module.exports = router;
