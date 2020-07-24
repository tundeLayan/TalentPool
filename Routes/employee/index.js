const express = require('express');
const demoTwo = require('./demo-two');
const demoThree = require('./demo-three');
const dashboard = require('./dashboard');

const router = express.Router();
router.use('/profile', demoTwo);
router.use('/another', demoThree);
router.use('/', dashboard)

module.exports = router;
