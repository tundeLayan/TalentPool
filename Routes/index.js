const express = require('express');
const { home } = require('../Controllers/external-pages/home');
const { about } = require('../Controllers/external-pages/about');
const { login } = require('../Controllers/external-pages/login');

const router = express.Router();

router.get('/', home);
router.get('/about', about);
router.get('/login', login);

module.exports = router;