const express = require('express');

const router = express.Router();
const admin = require('./admin');
const faqRoute = require('./faq');
const dashboard = require('./dashboard');
const { authorisedPages, } = require('../../Middleware/auth');
const verification = require('./verification');

const roleSuperAdmin = 'ROL-SUPERADMIN';
const roleAdmin = 'ROL-ADMIN';

router.use('/dashboard', authorisedPages(roleAdmin, roleSuperAdmin), dashboard);
router.use('/', authorisedPages(roleAdmin, roleSuperAdmin), admin);
router.use('/faq', authorisedPages(roleAdmin, roleSuperAdmin), faqRoute);
router.use('/verification', authorisedPages(roleAdmin, roleSuperAdmin), verification);

module.exports = router;
