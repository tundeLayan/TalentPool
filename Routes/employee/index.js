const express = require('express');
const demoTwo = require('./demo-two');
const demoThree = require('./demo-three');
const dashboard = require('./dashboard');
const message = require('./message');
const { authorisedPages } = require('../../Middleware/auth');

const router = express.Router();
router.use('/profile', demoTwo);
router.use('/another', demoThree);
router.use('/message',  authorisedPages,  message);
router.use('/dashboard', authorisedPages, dashboard);

module.exports = router;
