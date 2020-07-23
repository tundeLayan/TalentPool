const router = require('express').Router();
const { employeeDashboard } = require('../../Controllers/auth/auth');

router.get('/' , employeeDashboard);

module.exports = router;