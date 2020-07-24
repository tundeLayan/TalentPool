const express = require('express');
const router = express.Router();
const employee = require('./employee');
const admin = require('./admin');
const faqRoute = require('./faq');

router.use(employee);
router.use(admin);
router.use('/faq',faqRoute);

module.exports = router
