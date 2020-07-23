const { validationResult } = require('express-validator');
// const { errorUserSignup} = require('./response');

// eslint-disable-next-line consistent-return
const validateUserRequest = (req, res, firstName , lastName, email, password) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors.array()[0].msg;
    // error.forEach((err) => errorMessage.push(err.msg));
    res.status(401).render('auth/employerSignUp', {
      pageName: 'Employer Registration',
      path: '/employer/register',
      errorMessage,
      success: req.flash('success'),
      oldInput: {
        firstName,
        lastName,
        email,
        password,
      },
      validationErrors: errors.array(),
    });
    // return errorUserSignup(req, res,firstName , lastName, email, password, errorMessage);
  }
};



module.exports.validateUserRequest = validateUserRequest;