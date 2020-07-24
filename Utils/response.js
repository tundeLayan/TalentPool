
module.exports = {
  authErrorRedirect: (
    req,
    res,
    email,
    password,
    errorMessage,
    page,
    title,
    pagePath,
  ) => {
    const { isLoggedIn } = req.session;
    return res.status(401).render(`${page}`, {
      path: `${pagePath}`,
      pageName: `${title}`,
      errorMessage,
      isLoggedIn,
      success: req.flash('success'),
      oldInput: {
        email,
        password,
      },
      validationErrors: [],
    });
  },
};

module.exports.errorUserSignup = (
  req,
  res,
  firstName,
  lastName,
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

  const employeeSignupRedirect = (req, res, error, userData) => {
    req.flash('error', error);
    req.flash('oldInput', userData);
    return res.redirect('/employee/register');
  }

module.exports.employeeSignupRedirect = employeeSignupRedirect;