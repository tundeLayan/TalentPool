const express = require('express');
const faqRoute = require('./faq')

const router = express.Router();
router.use('/faq',faqRoute)

module.exports = router