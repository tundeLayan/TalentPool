const express = require('express');
const demoTwo = require('./demo-two');
const demoThree = require('./demo-three');
const dashboard = require('./dashboard');
const message = require('./message');

const router = express.Router();
router.use('/profile', demoTwo);
router.use('/another', demoThree);
router.use('/message', message);
router.use('/dashboard', dashboard);

module.exports = router;
