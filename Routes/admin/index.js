const express = require('express');
const router = express.Router();
const admin = require('./admin');
const faqRoute = require('./faq');
const dashboard = require('./dashboard');

router.use(dashboard);
router.use(admin);
router.use('/faq',faqRoute);

module.exports = router
