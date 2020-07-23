const express = require('express');

const router = express.Router();
const {
  registerEmployer,
  verifyEmail,
  employerSignup,
} = require('../../Controllers/auth/auth');
const { validateSignup} = require('../../Utils/validators/auth-validator');


router.get('/employer/register' , employerSignup);
router.get('/email/verify', verifyEmail);
router.post('/employer/register', validateSignup, registerEmployer);

module.exports = router;