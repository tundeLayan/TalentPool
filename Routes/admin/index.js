const express = require('express');
const faqRoute = require('./faq')
const dashboard = require('./dashboard');
const employer = require('./employer');
const verification = require('./verification');

const router = express.Router();
<<<<<<< HEAD

router.use('/faq',faqRoute)
router.use(dashboard);
router.use(employer);
router.use(verification);

module.exports = router;
=======
router.use('/faq', faqRoute)

module.exports = router
>>>>>>> f7b637eb6f3eed65721f18e9c7639f9809685aa8
