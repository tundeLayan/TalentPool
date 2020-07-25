const router = require('express').Router();
const { getProfilePage } = require('../../Controllers/employee/profile');

router.get('/profile', getProfilePage);

module.exports = router;
