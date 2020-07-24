const router = require('express').Router();
const passport = require('passport');
const { 
  authCallbackHandler,
  getUserProfile,
  handAuthCallback,
 } = require('../../Utils/passport-helper');

router.get('/auth/employer/google', getUserProfile('google-employer'));

router.get('/auth/employee/google', getUserProfile('google-employer'));
 
router.get('/auth/employer/google/callback', authCallbackHandler('google-employer'), handAuthCallback);

router.get('/auth/employee/google/callback', authCallbackHandler('google-employee'), handAuthCallback);

router.get('/auth/employer/github', passport.authenticate('github-employer'));

router.get(
  '/auth/github/callback', authCallbackHandler('github-employer'), handAuthCallback);

router.get('/auth/employee/github', passport.authenticate('github-employee'));

router.get(
  '/auth/employee/github/callback/', authCallbackHandler('github-employer'),handAuthCallback
);
module.exports = router;
