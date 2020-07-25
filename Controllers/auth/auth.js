const { uuid } = require('uuidv4');
const { validationResult } = require('express-validator');

const sendEmail = require('../../Utils/send-email');
const jsonWT = require('../../Utils/auth-token');
const { message } = require('../../Utils/email-signup-template');
const { renderPage } = require('../../Utils/render-page');
const { createUser, getUserByEmail} = require('../dao/db-queries');
const { employeeSignupRedirect } = require('../../Utils/response');
const model = require('../../Models/index');

const { validateUserRequest } = require('../../Utils/request-body-validator');
const { userCheck ,userCreate,userUpdate } = require('../../Utils/user-check');
const { passwordHash } = require('../../Utils/password-hash');
const {
  errorUserSignup,
} = require('../../Utils/response');

const redis = require('../dao/impl/redis/redis-client');
const redisKeys = require('../dao/impl/redis/redis-key-gen');

const client = redis.getClient();

const URL = process.env.NODE_ENV === 'development'
  ? process.env.TALENT_POOL_DEV_URL
  : process.env.TALENT_POOL_FRONT_END_URL;

const registerEmployeePage = (req, res) => {
  const data = {
    pageName: 'Employee Signup',
    oldInput: req.flash('oldInput'),
    error: req.flash('error'),
    errors: req.flash('errors'),
    success: req.flash('success')
  }
  renderPage(res, 'auth/employeeSignUp', data, 'Employer Registration', '/employee/register');
}

const registerEmployee = async (req, res) => {
  const { firstName, lastName, email, password, hngId } = req.body;

  const employeeUserData = {
    hngId,
    firstName,
    lastName,
    email,
  };

  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errResponse = errors.array({ onlyFirstError: true });
      return employeeSignupRedirect(req, res, errResponse[0].msg, employeeUserData);
    }
    // const userExists = await model.User.findOne({ where: { email } });
    const userExists = await getUserByEmail(model,email);
    if (userExists) {
      const errmessage = 'Someone has already registered this email';
      return employeeSignupRedirect(req, res, errmessage, employeeUserData);
    }

    const hashedPassword = await jsonWT.hashPassword(password);
    // jwtoken
    const data = {
      email,
    };
    const token = jsonWT.signJWT(data);
    const userId = uuid();
    const userSave = {
      email,
      firstName,
      lastName,
      password: hashedPassword,
      roleId: 'ROL-EMPLOYEE',
      userId,
    };

    // const employeeSave = {
    //   userId,
    //   hngId,
    // };

    // create new user and send verification mail
    try {
      createUser(model,userSave);
      // if (user.hngId) {
      //   await model.Employee.create(employeeSave);
      // }
      const verificationUrl = `${URL}/email/verify?verificationCode=${token}`;
      await sendEmail({
        email,
        subject: 'TalentPool | Email verification',
        message: await message(verificationUrl),
      });
      req.flash('success', 'Verification email sent!');
      return res.redirect('/employee/register');

    } catch (error) {
      const errmessage = 'An Error occoured, try again.';
      return employeeSignupRedirect(req, res, errmessage, employeeUserData);
    }
  } catch (error) {
    const errmessage = 'An Error occoured';
    return employeeSignupRedirect(req, res, errmessage, employeeUserData);
  }
};

const resendVerificationLink = async (req, res) => {
  const { email } = req.body;
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errResponse = errors.array({
      onlyFirstError: true,
    });
    req.flash('error', errResponse[0].msg);
    return res.redirect('/email/verify');
  }

  // check if user exist
  const checkUser = getUserByEmail(model,email);
  if (!checkUser) {
    req.flash('error', 'Invalid email');
    return res.redirect('/email/verify');
  }

  if (checkUser.status === '1') {
    req.flash('error', 'This email has been verified');
    return res.redirect('/email/verify');
  }

  // generate new verification_token
  const token = jsonWT.signJWT(checkUser.email);

  // mail verification code to the user
  const verificationUrl = `${URL}/email/verify?verificationCode=${token}`;
  const verificationMessage = `<p> Hello, you requested for the resend of your verification link.
        Kindly verify your email </p><a href ='${verificationUrl}'>link</a>`;
  try {
    await sendEmail({
      email: checkUser.email,
      subject: 'Email verification',
      verificationMessage,
    });
    req.flash(
      'success',
      'Please check your email. Verification link has been sent.',
    );
    return res.redirect('/email/verify');
  } catch (err) {
    return renderPage(res, 'auth/verifyEmail', [], 'Verify Email');
  }
};

const employerSignup= (req, res) => {
  const success = req.flash('success');
  let errMessage = req.flash('error');
  if (errMessage.length > 0) {
    [errMessage] = errMessage;
  } else {
    errMessage = null;
  }
  const data = {
    pageName: 'Employer Registration',
    success,
    errorMessage: errMessage,
    oldInput: {
      email: '',
      password: '',
    },
    validationErrors: [],
  }
  renderPage(res ,'auth/employerSignUp',data,'Employer Registration','/employer/register' )

};

const registerEmployer = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const employerUserData = {
    firstName,
    lastName,
    email,
    password,
  };
  try {
    validateUserRequest(req, res, firstName ,lastName, email, password);
    const userExists = await getUserByEmail(model,email);
    if (userExists) {
      return errorUserSignup(req, res, firstName,
        lastName, email,
        password, 'Someone has already registered this email.',);
    }
    const hashedPassword = await passwordHash(password);
    const data = { email };
    const token = jsonWT.signJWT(data);
    const userSave = {
      email,
      firstName,
      lastName,
      password: hashedPassword,
      roleId: 'ROL-EMPLOYER',
      userId: uuid(),
    };
    try {
     await userCreate(userSave);
      const verificationUrl = `${URL}/email/verify?verificationCode=${token}`;
      await sendEmail({
        email,
        subject: 'TalentPool User Email verification',
        message: await message(verificationUrl),
      });
      req.flash('success', 'Verification email sent!');
      return res.redirect('/employer/register');
    } catch (error) {
      return errorUserSignup(req, res,
        firstName ,lastName, email,
        password, 'An Error occurred,try again',);
    }
  } catch (error) {
    req.flash('error', 'An Error occurred,try again.');
    req.flash('oldInput', employerUserData);
    return res.redirect('/employer/register');
  }
};

// VERIFY EMAIL
// eslint-disable-next-line consistent-return
const verifyEmail = async (req, res) => {
  try {
    const { verificationCode } = req.query;
    const decoded = jsonWT.verifyJWT(verificationCode);
    const user = await userCheck(decoded.email);
    if (Date.now() <= decoded.exp + Date.now() + 60 * 60) {
      if (!user) {
        req.flash('error', 'Email has not been registered');
        return res.redirect('/');
      }
      if (user.status === '1') {

        req.flash('success', 'This email has been verified');
        return res.redirect('/login');
      }
      const updateUser = await userUpdate(user.email);
      const data = await updateUser;
      if (data[0] === 1) {
        user.status = 1;
        const keyId = redisKeys.getHashKey(user.email.toString());
        client.set(keyId,  JSON.stringify(user));
        req.flash('success', 'Email verification successful');
        return res.redirect('/login');
      }
    } else {
      req.flash('error', 'Sorry, the verification token is either invalid or has expired. ');
      return res.redirect('/email/verify/resend');
    }
  } catch (error) {
    req.flash('error', 'Sorry, the verification token is either invalid or has expired. ');
    return res.redirect('/email/verify/resend');
  }
};

// TODO: Make sure this page is filled and the mail input makes a post request to line 104
const getResendValidationMail = (req, res) => {
  return renderPage(res, 'auth/verifyEmail', [], 'Verify Email');
};

module.exports = {

  registerEmployee,
  registerEmployeePage,
  resendVerificationLink,
  getResendValidationMail,
  registerEmployer,
  verifyEmail,
  employerSignup
};

