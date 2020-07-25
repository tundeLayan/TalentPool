const { validationResult } = require('express-validator');
const { renderPage } = require('./render-page');
// eslint-disable-next-line consistent-return
const validateUserRequest = (req, res, firstName , lastName, email, password) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors.array()[0].msg;
    const data = {
      pageName: 'Employer Registration',
      success: req.flash('success'),
      errorMessage,
      oldInput: {
        firstName,
        lastName,
        email,
        password,
      },
      validationErrors: errors.array(),
    }
    renderPage(res ,'auth/employerSignUp',data,'Employer Registration','/employer/register' )
  
  
  
  
  
  
  
  
  
  
  
  
  
    // res.render('auth/employerSignUp', {
    //   pageName: 'Employer Registration',
    //   path: '/employer/register',
    //   errorMessage,
    //   success: req.flash('success'),
    //   oldInput: {
    //     firstName,
    //     lastName,
    //     email,
    //     password,
    //   },
    //   validationErrors: errors.array(),
    // });
  }
};



module.exports.validateUserRequest = validateUserRequest;