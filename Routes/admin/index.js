const express = require('express');

const router = express.Router();
const admin = require('./admin');
const faqRoute = require('./faq');
const dashboard = require('./dashboard');
const verification = require('./verification');

router.use(dashboard);
router.use(admin);
router.use('/faq',faqRoute);
router.use(verification);

module.exports = router
