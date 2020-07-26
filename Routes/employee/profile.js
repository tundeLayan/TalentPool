const router = require('express').Router();
const { getProfilePage } = require('../../Controllers/employee/profile');

router.get('/', getProfilePage);

module.exports = router;
