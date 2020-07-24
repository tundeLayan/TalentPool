const express = require('express');
const { home } = require('../Controllers/external-pages/home');
const { about } = require('../Controllers/external-pages/about');

const router = express.Router();

router.get('/', home);
router.get('/about', about);

module.exports = router;
