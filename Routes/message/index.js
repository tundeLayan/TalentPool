const express = require('express');
const {
    employerMessagePage,
    employeeMessagePage,
    chatMessages
} = require('../../Controllers/message/message');


const router = express.Router();

// UI route
router.get('/employer', employerMessagePage);
router.get('/employee', employeeMessagePage);

// chat message Routes
router.get('/:senderID/:receiverID', chatMessages);

module.exports = router;