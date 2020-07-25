const express = require('express');
const { home } = require('../Controllers/external-pages/home');
const { checkLoggedIn } = require('../Middleware/auth')
const { about } = require('../Controllers/external-pages/about');
const { verifyInvite } = require('../Controllers/employer/team');
const { chatMessages } = require('../Controllers/message/message');

const router = express.Router();

router.get('/', checkLoggedIn, home);
router.get('/about', about);
router.get('/message/:senderID/:receiverID', chatMessages);
router.get('/team/verify-invite', verifyInvite);

module.exports = router;
