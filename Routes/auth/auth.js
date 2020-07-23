const express = require('express');

const router = express.Router();
const {
  registerEmployee,
  resendVerificationLink,
} = require('../../Controllers/auth/auth');
const { validateSignup, validateEmail } = require('../../Utils/validators/auth-validator');

router.post('/employee/register', validateSignup, registerEmployee);
router.post('/email/verify/resend', validateEmail, resendVerificationLink);

module.exports = router;
