
const errorUserSignup = (
  req,
  res,
  firstName , lastName,
  email,
  password,
  errorMessage,
) =>
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
    validationErrors: [],
  });


module.exports.errorUserSignup = errorUserSignup;
