const router = require('express').Router();
const {
  getUpdateProfilepage,
  updateProfile,
} = require('../../Controllers/employee/profile');

router.get('/profile', getUpdateProfilepage);
router.patch('/profile', updateProfile);

module.exports = router;
