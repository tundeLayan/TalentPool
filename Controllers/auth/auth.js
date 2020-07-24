const { uuid } = require('uuidv4');
const bcrypt = require('bcryptjs');
const { validationResult, body } = require('express-validator');
const model = require('../../Models/index');
const sendEmail = require('../../Utils/send-email');
const jsonWT = require('../../Utils/auth-token');
const { message } = require('../../Utils/email-signup-template');
const { renderPage } = require('../../Utils/render-page');

const URL = process.env.NODE_ENV === 'development' ? process.env.TALENT_POOL_DEV_URL : process.env.TALENT_POOL_FRONT_END_URL;

const registerEmployeePage = (req, res) => {
  renderPage(res, 'auth/employeeSignUp', { oldInput: req.flash('oldInput'), error: req.flash('error'), errors: req.flash('errors'),success: req.flash('success') }, 'Employer Registration', '/employee/register');
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
      req.flash('error', errResponse[0].msg);
      req.flash('oldInput', employeeUserData);
      return res.redirect('/employee/register');
    }

    const userExists = await model.User.findOne({ where: { email } });
    if (userExists !== null) {
      req.flash('error', 'Someone has already registered this email');
      req.flash('oldInput', employeeUserData);
      return res.redirect('/employee/register');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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

    const employeeSave = {
      userId,
      hngId,
    };

    // create new user and send verification mail
    try {
      await model.User.create(userSave);
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
      req.flash('error', 'An Error occoured, try again.' + error);
      req.flash('oldInput', employeeUserData);
      return res.redirect('/employee/register');
    }
  } catch (error) {
    req.flash('error', 'An Error occoured');
    req.flash('oldInput', employeeUserData);
    return res.redirect('/employee/register');
  }
};

const resendVerificationLink = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errResponse = errors.array({
      onlyFirstError: true,
    });
    req.flash('error', errResponse[0].msg);
    return res.redirect('/verify-email');
  }

  // check if user exist
  const checkUser = await model.User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!checkUser) {
    req.flash('error', 'Invalid email');
    return res.redirect('/verify-email');
  }

  if (checkUser.status === '1') {
    req.flash('error', 'This email has been verified');
    return res.redirect('/verify-email');
  }

  const basicInfo = {
    email: checkUser.email,
  };

  // generate new verification_token
  const token = jsonWT.signJWT(basicInfo);
  checkUser.verification_token = token;
  checkUser.save();

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
    return res.redirect('/verify-email');
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return res.render('Pages/verify-email', {
      PageName: 'Verify Email',
    });
  }
};

module.exports = {
  registerEmployee,
  registerEmployeePage,
  resendVerificationLink,
};
