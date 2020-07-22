/* eslint-disable consistent-return */
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const model = require('../Models/index');
const { getUserData, createUser } = require('../Utils/passport-helper');

// serialize user object and send as a cookie
passport.serializeUser((user, done) => {
  done(null, user);
});

// deserialize user object
passport.deserializeUser(async (id, done) => {
  try {
    done(null, id);
  } catch (error) {
    console.log(error);
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
        const checkUser = await model.User.findOne({
          where: {
            email: profile.emails[0].value,
          },
        });
        const user = await checkUser;
        if (user) {
          // user exists, send user object for serialization
          const data = await getUserData(req, profile, user, done);
          done(null, data);
        } else {
          // create a new user
          const userData = await createUser(profile, 'ROL-EMPLOYER');

          return done(null, userData);
        }
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
        const checkUser = await model.User.findOne({
          where: {
            email: profile.emails[0].value,
          },
        });
        const user = await checkUser;
        if (user) {
          // user exists, send user object for serialization
          const data = await getUserData(req, profile, user, done);
          done(null, data);
        } else {
          // create a new user
          const userData = await createUser(profile, 'ROL-EMPLOYEE');

          return done(null, userData);
        }
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
        const checkUser = await model.User.findOne({
          where: {
            email: profile.emails[0].value,
          },
        });
        const user = await checkUser;
        if (user) {
          // user exists, send user object for serialization
          const data = await getUserData(req, profile, user, done);
          done(null, data);
        } else {
          // create a new user
          const userData = await createUser(profile, 'ROL-EMPLOYER');

          return done(null, userData);
        }
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
        const checkUser = await model.User.findOne({
          where: {
            email: profile.emails[0].value,
          },
        });
        const user = await checkUser;
        if (user) {
          // user exists, send user object for serialization
          const data = await getUserData(req, profile, user, done);
          done(null, data);
        } else {
          // create a new user
          const userData = await createUser(profile, 'ROL-EMPLOYEE');

          return done(null, userData);
        }
      } catch (error) {
        return done(null, false, req.flash('error', 'Authentication error'));
      }
    },
  ));
