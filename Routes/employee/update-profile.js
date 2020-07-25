const router = require('express').Router();
const {
  getUpdateProfilepage,
  updateProfile,
} = require('../../Controllers/employee/profile');

router.get('/update/profile', getUpdateProfilepage);
router.patch('/update/profile', updateProfile);

module.exports = router;
