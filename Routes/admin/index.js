const express = require('express');
const faqRoute = require('./faq')
const dashboard = require('./dashboard');

const router = express.Router();
router.use('/faq', faqRoute)
router.use(dashboard);


module.exports = router
