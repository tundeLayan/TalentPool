const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const csrf = require('csurf');
const dotenv = require('dotenv');
const logger = require('morgan');
const { key } = require('./Utils/gen-key');

dotenv.config();
process.env.TALENT_POOL_JWT_SECRET = key(64);
process.env.TALENT_POOL_SESSION_COOKIEKEY = key(64);

const db = require('./Models');
const { seedSuperAdmin } = require('./Utils/seed');
const demo = require('./Routes/demo');

const csrfProtection = csrf();
const app = express();

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    name: 'session',
    keys: [process.env.TALENT_POOL_SESSION_COOKIEKEY],
  }),
);
app.use(csrfProtection);
app.use((req, res, next) => {
  const token = req.csrfToken();
  res.cookie('csrf-token', token);
  res.locals.csrfToken = req.csrfToken();
  next();
});

db.sequelize.sync().then(async () => {
  try {
    await seedSuperAdmin();
  } catch (e) {
    console.log(e);
  }
});

// Cookie Parser
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ************ REGISTER ROUTES HERE ********** //
app.use('/', demo);

// ************ END ROUTE REGISTRATION ********** //

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  next();
});

module.exports = app;
