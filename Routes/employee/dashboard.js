const router = require('express').Router();
const { dashboardHandler } = require('../../Controllers/employee/dashboard');

router.get('/dashboard', dashboardHandler);

module.exports = router;
