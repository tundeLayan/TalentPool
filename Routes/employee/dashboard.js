const router = require('express').Router();
// const { dashboardHandler } = require('../../Controllers/employee/dashboard');
const { getEmployeeDashboardPage } = require('../../Controllers/employee/profile');

router.get('/', getEmployeeDashboardPage);

module.exports = router;
