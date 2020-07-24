const express = require('express');

const router = express.Router();
const {
  registerEmployee,
  registerEmployeePage,
  resendVerificationLink,
  registerEmployer,
  verifyEmail,
  employerSignup,
} = require('../../Controllers/auth/auth');
const { validateSignup, validateEmail } = require('../../Utils/validators/auth-validator');

router.get('/employee/register', registerEmployeePage);
router.post('/employee/register', validateSignup, registerEmployee);
router.post('/email/verify/resend', validateEmail, resendVerificationLink);
router.get('/employer/register' , employerSignup);
router.get('/email/verify', verifyEmail);
router.post('/employer/register', validateSignup, registerEmployer);

module.exports = router;

