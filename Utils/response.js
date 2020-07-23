
const sessionSuccessResMsg = (res, message, code, token, user) =>
  res.status(code).json({
    status: 'success',
    message,
    data: {
      authenticated: true,
      token,
      user,
    },
  });

const errorUserSignup = (
  req,
  res,
  firstName , lastName,
  email,
  password,
  errorMessage,
) =>
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
    validationErrors: [],
  });


module.exports.errorUserSignup = errorUserSignup;
module.exports.sessionSuccessResMsg = sessionSuccessResMsg;
