const express = require('express');
const passport = require('passport');
const { login, logout } = require('../../Controllers/auth/login');
const { loginPage } = require('../../Controllers/external-pages/login');

const {
  authCallbackHandler,
  getUserProfile,
  handAuthCallback,
 } = require('../../Utils/passport-helper');
const {
  registerEmployee,
  registerEmployeePage,
  resendVerificationLink,

  registerEmployer,
  verifyEmail,
  employerSignup,
} = require('../../Controllers/auth/auth');
const { validateSignup, validateEmail } = require('../../Utils/validators/auth-validator');

const router = express.Router();

router.get('/auth/employer/google', getUserProfile('google-employer'));
router.get('/auth/employee/google', getUserProfile('google-employer'));

router.get('/auth/employer/google/callback', authCallbackHandler('google-employer'), handAuthCallback);
router.get('/auth/employee/google/callback', authCallbackHandler('google-employee'), handAuthCallback);

router.get('/auth/employer/github', passport.authenticate('github-employer'));
router.get('/auth/employee/github', passport.authenticate('github-employee'));

router.get(
  '/auth/github/callback', authCallbackHandler('github-employer'), handAuthCallback);
router.get(
  '/auth/employee/github/callback/', authCallbackHandler('github-employer'),handAuthCallback
);

router.get('/employee/register', registerEmployeePage);
router.post('/employee/register', validateSignup, registerEmployee);

router.get('/employer/register' , employerSignup);
router.post('/employer/register', validateSignup, registerEmployer);

router.get('/email/verify', verifyEmail);
router.post('/email/verify/resend', validateEmail, resendVerificationLink);

router.get('/login', loginPage);
router.post('/login', login);

router.get('/logout', logout);

module.exports = router;
