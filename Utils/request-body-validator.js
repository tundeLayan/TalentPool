const { validationResult } = require('express-validator');

// eslint-disable-next-line consistent-return
const validateUserRequest = (req, res, firstName , lastName, email, password) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors.array()[0].msg;
    // error.forEach((err) => errorMessage.push(err.msg));
    res.render('auth/employerSignUp', {
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
  }
};



module.exports.validateUserRequest = validateUserRequest;