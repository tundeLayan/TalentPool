const router = require('express').Router();
const passport = require('passport');
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


router.get('/auth/employer/google', getUserProfile('google-employer'));

router.get('/auth/employee/google', getUserProfile('google-employee'));
 
router.get('/auth/employer/google/callback', authCallbackHandler('google-employer'), handAuthCallback);

router.get('/auth/employee/google/callback', authCallbackHandler('google-employee'), handAuthCallback);

router.get('/auth/employer/github', passport.authenticate('github-employer'));

router.get(
  '/auth/github/callback', authCallbackHandler('github-employer'), handAuthCallback);

router.get('/auth/employee/github', passport.authenticate('github-employee'));

router.get(
  '/auth/employee/github/callback/', authCallbackHandler('github-employee'),handAuthCallback
);

router.get('/employee/register', registerEmployeePage);
router.post('/employee/register', validateSignup, registerEmployee);
router.post('/email/verify/resend', validateEmail, resendVerificationLink);
router.get('/employer/register' , employerSignup);
router.get('/email/verify', verifyEmail);
router.post('/employer/register', validateSignup, registerEmployer);

module.exports = router;

