const { uuid } = require('uuidv4');
const bcrypt = require('bcryptjs');
const model = require('../../Models/index');
const sendEmail = require('../../Utils/send-email');
const jsonWT = require('../../Utils/auth-token');
const { message } = require('../../Utils/email-signup-template');
const { validateUserRequest, } = require('../../Utils/request-body-validator');
const {
  errorUserSignup,
} = require('../../Utils/response');

const URL =
  process.env.NODE_ENV === 'development' ?
    process.env.TALENT_POOL_DEV_URL :
    process.env.TALENT_POOL_FRONT_END_URL;

    
const employerSignup= (req, res) => {
  const success = req.flash('success');
  let errMessage = req.flash('error');
  if (errMessage.length > 0) {
    [errMessage] = errMessage;
  } else {
    errMessage = null;
  }
  return res.render('auth/employerSignUp', {
    pageName: 'Employer Registration',
    path: '/employer/register',
    success,
    errorMessage: errMessage,
    oldInput: {
      email: '',
      password: '',
    },
    validationErrors: [],
  });
};

const registerEmployer = async (req, res) => {
  const user = req.body;
  const employerUserData = {
    firstname: req.body.firstName,
    lastname: req.body.lastName,
    email: req.body.email,
  };
  try {
    validateUserRequest(req, res, user.firstName ,user.lastName, user.email, user.password);
    const { email } = user;
    const userExists = await model.User.findOne({ where: { email } });
    if (userExists !== null) {
      return errorUserSignup(req, res, user.firstName ,user.lastName, user.email, user.password, 'Someone has already registered this email.',);
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(user.password, salt);
    const data = { email: user.email };
    const token = jsonWT.signJWT(data);
    const userSave = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: hashedPassword,
      roleId: 'ROL-EMPLOYER',
      userId: uuid(),
    };
    try {
      await model.User.create(userSave);
      const verificationUrl = `${URL}/email/verify?verificationCode=${token}`;
      await sendEmail({
        email: userSave.email,
        subject: 'TalentPool | Email verification',
        message: await message(verificationUrl),
      });
      req.flash('success', 'Verification email sent!');
      return res.redirect('/employer/register');
    } catch (error) {
      return errorUserSignup(req, res, user.firstName ,user.lastName, user.email, user.password, 'An Error occured,try again',);
    }
  } catch (error) {
    req.flash('error', 'An Error occured,try again.');
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

    const user = await model.User.findOne({
      where: { email: decoded.email },
    });
    if (Date.now() <= decoded.exp + Date.now() + 60 * 60) {
      if (!user) {
        req.flash('error', 'Email has not been registered');
        return res.redirect('/employer/register');
      }
      if (user.status === '1') {
        if (user.role_id === 'ROL-EMPLOYER') {
          req.flash('success', 'This email has been verified');
          return res.redirect('/employer/login');
        }
        req.flash('success', 'This email has been verified');
        return res.redirect('/employee/login');
      }
      const updateUser = await model.User.update(
        { status: '1' },
        { where: { email: user.email,}},
         
      );
      const data = await updateUser;
      if (data[0] === 1) {
        if (user.role_id === 'ROL-EMPLOYER') {
          req.flash('success', 'Email verification successful');
          return res.redirect('/employer/login');
        }
        req.flash('success', 'Email verification successful');
        return res.redirect('/employee/login');
      }
    } else {
      req.flash('error', 'Sorry, this link is either invalid or has expired. ');
      return res.redirect('/reverifyemail');
    }
  } catch (error) {
    req.flash('error', 'Sorry, this link is either invalid or has expired. ');
    return res.redirect('/reverifyemail');
  }
};

module.exports = {
  registerEmployer,
  verifyEmail,
  employerSignup
};
