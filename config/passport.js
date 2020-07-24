const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const { getUserData, createUser, checkUser } = require('../Utils/passport-helper');

// serialize user object and send as a cookie
passport.serializeUser((user, done) => {
  return done(null, user);
});

// deserialize user object
passport.deserializeUser(async (id, done) => {
  try {
    return done(null, id);
  } catch (error) {
    return done(null, false);
  }
});

// employer google auth
passport.use('google-employer',
  new GoogleStrategy(
    {
      passReqToCallback: true,
      clientID: process.env.TALENT_POOL_GOOGLE_CLIENTID,
      clientSecret: process.env.TALENT_POOL_GOOGLE_CLIENTSECRET,
      callbackURL: process.env.TALENT_POOL_GOOGLE_EMPLOYER_CALLBACKURL,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // check user in our db
        const user = await checkUser(profile.emails[0].value);
        if (user) {
          // user exists, send user object for serialization
          const data = await getUserData(req, profile, user, done);
         return done(null, data);
        }
        // create a new user
        const userData = await createUser(req, profile, 'ROL-EMPLOYER', done);

        return done(null, userData);
      } catch (error) {
        return done(null, false, req.flash('error', 'Authentication error'));
      }
    },
  ));

// employee google authentication
passport.use('google-employee',
  new GoogleStrategy(
    {
      passReqToCallback: true,
      clientID: process.env.TALENT_POOL_GOOGLE_CLIENTID,
      clientSecret: process.env.TALENT_POOL_GOOGLE_CLIENTSECRET,
      callbackURL: process.env.TALENT_POOL_GOOGLE_EMPLOYEE_CALLBACKURL,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // check user in our db
        const user = await checkUser(profile.emails[0].value);
        if (user) {
          // user exists, send user object for serialization
          const data = await getUserData(req, profile, user, done);
          return done(null, data);
        }
        // create a new user
        const userData = await createUser(req, profile, 'ROL-EMPLOYEE', done);
        return done(null, userData);
      } catch (error) {
        return done(null, false, req.flash('error', 'Authentication error'));
      }
    },
  ));

// employer github auth
passport.use('github-employer',
  new GitHubStrategy(
    {
      passReqToCallback: true,
      clientID: process.env.TALENT_POOL_GITHUB_CLIENTID,
      clientSecret: process.env.TALENT_POOL_GITHUB_CLIENTSECRET,
      callbackURL: process.env.TALENT_POOL_GITHUB_CALLBACKURL,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // check user in our db
        const user = await checkUser(profile.emails[0].value);
        if (user) {
          // user exists, send user object for serialization
          const data = await getUserData(req, profile, user, done);
          return done(null, data);
        }
        // create a new user
        const userData = await createUser(req, profile, 'ROL-EMPLOYER', done);

        return done(null, userData);
      } catch (error) {
        return done(null, false, req.flash('error', 'Authentication error'));
      }
    },
  ));

// employee github authentication
passport.use('github-employee',
  new GitHubStrategy(
    {
      passReqToCallback: true,
      clientID: process.env.TALENT_POOL_GITHUB_EMPLOYEE_CLIENTID,
      clientSecret: process.env.TALENT_POOL_GITHUB_EMPLOYEE_CLIENTSECRET,
      callbackURL: process.env.TALENT_POOL_GITHUB_EMPLOYEE_CALLBACKURL,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // check user in our db
        const user = await checkUser(profile.emails[0].value);
        if (user) {
          // user exists, send user object for serialization
          const data = await getUserData(req, profile, user, done);
          return done(null, data);
        }
        // create a new user
        const userData = await createUser(req, profile, 'ROL-EMPLOYEE', done);

        return done(null, userData);
      } catch (error) {
        return done(null, false, req.flash('error', 'Authentication error'));
      }
    },
  ));
