const express = require('express');
const passport = require('passport');
const { checkLoggedIn } = require('../../Middleware/auth');
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
  getResendValidationMail,
  registerEmployer,
  verifyEmail,
  employerSignup,
} = require('../../Controllers/auth/auth');
const { validateSignup, validateEmail } = require('../../Utils/validators/auth-validator');

const router = express.Router();

router.get('/auth/employer/google', checkLoggedIn, getUserProfile('google-employer'));
router.get('/auth/employee/google', checkLoggedIn, getUserProfile('google-employee'));

router.get('/auth/employer/google/callback', checkLoggedIn, authCallbackHandler('google-employer'), handAuthCallback);
router.get('/auth/employee/google/callback', checkLoggedIn, authCallbackHandler('google-employee'), handAuthCallback);

router.get('/auth/employer/github', checkLoggedIn, passport.authenticate('github-employer'));
router.get('/auth/employee/github', checkLoggedIn, passport.authenticate('github-employee'));

router.get(
  '/auth/github/callback', checkLoggedIn, authCallbackHandler('github-employer'), handAuthCallback);
router.get(
  '/auth/employee/github/callback/', checkLoggedIn, authCallbackHandler('github-employee'),handAuthCallback
);

router.get('/employee/register', checkLoggedIn, registerEmployeePage);
router.post('/employee/register', checkLoggedIn, validateSignup, registerEmployee);

router.get('/employer/register', checkLoggedIn, employerSignup);
router.post('/employer/register', checkLoggedIn, validateSignup, registerEmployer);

router.get('/email/verify', verifyEmail);
router.post('/email/verify/resend', validateEmail, resendVerificationLink);
router.get('/email/verify/resend', getResendValidationMail);

router.get('/login', checkLoggedIn, loginPage);
router.post('/login', checkLoggedIn, login);

router.get('/logout', logout);

module.exports = router;
