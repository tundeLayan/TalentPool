const { uuid } = require('uuidv4');
const { validationResult } = require('express-validator');

const sendEmail = require('../../Utils/send-email');
const jsonWT = require('../../Utils/auth-token');
const { message } = require('../../Utils/email-signup-template');
const { renderPage } = require('../../Utils/render-page');
const { createUser, getUserByEmail} = require('../dao/db-queries');
const { employeeSignupRedirect } = require('../../Utils/response');

const URL = process.env.NODE_ENV === 'development' ? process.env.TALENT_POOL_DEV_URL : process.env.TALENT_POOL_FRONT_END_URL;

const registerEmployeePage = (req, res) => {
  const data = {
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
    const userExists = await getUserByEmail(email);
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
      createUser(userSave);
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
      console.log(error)
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
    return res.redirect('/verify/email');
  }

  // check if user exist
  const checkUser = getUserByEmail(email);
  if (!checkUser) {
    req.flash('error', 'Invalid email');
    return res.redirect('/verify/email');
  }

  if (checkUser.status === '1') {
    req.flash('error', 'This email has been verified');
    return res.redirect('/verify/email');
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
    return res.redirect('/verify/email');
  } catch (err) {
    return renderPage(res, 'auth/verifyEmail', [], 'Verify Email');
  }
};

module.exports = {
  registerEmployee,
  registerEmployeePage,
  resendVerificationLink,
};
