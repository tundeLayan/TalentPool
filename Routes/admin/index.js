const express = require('express');
const router = express.Router();
const admin = require('./admin');
const faqRoute = require('./faq');

router.use(admin);
router.use('/faq',faqRoute);

module.exports = router
