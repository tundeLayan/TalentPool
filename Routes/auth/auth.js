const router = require('express').Router();
const passport = require('passport');
const { renderPage } = require('../../Utils/passport-helper');
const { employerSignup, login } = require('../../Controllers/auth/auth')

router.get('/employer/register' , employerSignup);

router.get('/login', login);

// <----------------------- GOOOGLE ROUTES ------------------------------>

// get employer profile details from google
router.get(
  '/auth/employer/google',
  passport.authenticate('google-employer', { scope: ['profile', 'email'] }),
);

// get employee profile details from google
router.get(
  '/auth/employee/google',
  passport.authenticate('google-employee', { scope: ['profile', 'email'] }),
);

// receive process details from passport.setup
router.get(
  '/auth/employer/google/callback',
  passport.authenticate('google-employer', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  async (req, res) => {
    try {
      // Successful authentication,
      renderPage(req, res);
    } catch (error) {
      res.redirect('/login');
    }
  },
);
// receive process details from passport.setup
router.get(
  '/auth/employee/google/callback',
  passport.authenticate('google-employee', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  async (req, res) => {
    try {
      // Successful authentication,
      renderPage(req, res);
    } catch (error) {
      res.redirect('/login');
    }
  },
);
// <===================== END GOOGLE ===================>

// ------------------------- GITHUB ROUTES AND CONTROLLERS ---------------------->

// get employer profile details from github
router.get('/auth/employer/github', passport.authenticate('github-employer'));
// receive process details from passport.setup
router.get(
  '/auth/github/callback',
  passport.authenticate('github-employer', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  async (req, res) => {
    try {
      renderPage(req, res);
    } catch (error) {
      res.redirect('/login');
    }
  },
);
// get employee profile details from github
router.get('/auth/employee/github', passport.authenticate('github-employee'));

// receive process details from passport.setup
router.get(
  '/auth/employee/github/callback/',
  passport.authenticate('github-employee', {
    failureRedirect: '/employee/login',
    failureFlash: true,
  }),
  async (req, res) => {
    try {
      renderPage(req, res);
    } catch (error) {
      res.redirect('/login');
    }
  },
);
// <======================== END GITHUB =========================>
module.exports = router;
