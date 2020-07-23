const express = require('express');
const { login, logout } = require('../../Controllers/auth/login');

const router = express.Router();

router.post('/login', login);
router.get('/logout', logout);

module.exports = router;
