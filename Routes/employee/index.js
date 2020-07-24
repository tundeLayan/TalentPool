const express = require('express');
const demoTwo = require('./demo-two');
const demoThree = require('./demo-three');

const router = express.Router();
router.use('/profile', demoTwo);
router.use('/another', demoThree);

module.exports = router;
