const { uuid } = require('uuidv4');
const redis = require('redis');
const sendEmail = require('../../Utils/send-email');
const jsonWT = require('../../Utils/auth-token');
const { message } = require('../../Utils/email-signup-template');
const { validateUserRequest } = require('../../Utils/request-body-validator');
const { userCheck ,userCreate,userUpdate } = require('../../Utils/user-check');
const { passwordHash } = require('../../Utils/password-hash');
const {
  errorUserSignup,
} = require('../../Utils/response');
const { renderPage } = require('../../Utils/render-page');

const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = redis.createClient(REDIS_PORT);
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
    const userExists = await userCheck(email);
    if (userExists !== null) {
      return errorUserSignup(req, res, firstName ,lastName, email, password, 'Someone has already registered this email.',);
    }
    const hashedPassword = passwordHash(password);
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
      return errorUserSignup(req, res,firstName ,lastName, email, password, 'An Error occured,try again',);
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
    const user = await userCheck(decoded.email);
    if (Date.now() <= decoded.exp + Date.now() + 60 * 60) {
      if (!user) {
        req.flash('error', 'Email has not been registered');
        return res.redirect('/employer/register');
      }
      if (user.status === '1') {
        
        req.flash('success', 'This email has been verified');
        return res.redirect('/login');
      }
      const updateUser = await userUpdate(user.email);
      const status = "1";
      client.set(user.email, 3600, status);
      const data = await updateUser;
      if (data[0] === 1) {
        
        req.flash('success', 'Email verification successful');
        return res.redirect('/login');
      }
    } else {
      req.flash('error', 'Sorry, the verification token is either invalid or has expired. ');
      return res.redirect('/verify/email/resend');
    }
  } catch (error) {
    req.flash('error', 'Sorry, the verification token is either invalid or has expired. ');
    return res.redirect('/verify/email/resend');
  }
};

module.exports = {
  registerEmployer,
  verifyEmail,
  employerSignup
};
