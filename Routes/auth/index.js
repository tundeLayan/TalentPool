const express = require('express');
const { login, logout } = require('../../Controllers/auth/login');
const { loginPage } = require('../../Controllers/external-pages/login');

const router = express.Router();

// UI route
router.get('/login', loginPage);
// Authentication Routes
router.post('/login', login);
router.get('/logout', logout);

module.exports = router;
