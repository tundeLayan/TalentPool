const router = require('express').Router();
const { dashboardHandler } = require('../../Controllers/employee/dashboard');

router.get('/', dashboardHandler);

module.exports = router;
