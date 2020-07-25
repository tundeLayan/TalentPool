const express = require('express');
const faqRoute = require('./faq')
const dashboard = require('./dashboard');
const employer = require('./employer');

const router = express.Router();
router.use('/faq', faqRoute)
router.use(dashboard);
router.use(employer);


module.exports = router
