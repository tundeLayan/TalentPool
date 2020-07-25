const express = require('express');
const { home } = require('../Controllers/external-pages/home');
const { about } = require('../Controllers/external-pages/about');
const { verifyInvite } = require('../Controllers/employer/team');
const { chatMessages } = require('../Controllers/message/message');

const router = express.Router();

router.get('/', home);
router.get('/about', about);
router.get('/message/:senderID/:receiverID', chatMessages);
router.get('/team/verify-invite', verifyInvite);

module.exports = router;
