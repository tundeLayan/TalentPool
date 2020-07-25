const checkLoggedIn = (req, res, next) => {
  const { isLoggedIn, adminId, employeeId, employerId } = req.session;

  if (isLoggedIn && adminId) {
    res.redirect('/admin/dashboard');
  }

  const { passport } = req.session;
  if (req.session && !passport) {
    if (isLoggedIn && employeeId) {
      res.redirect(`/employee/dashboard`);
    } else if (isLoggedIn && employerId) {
      res.redirect('/employer/dashboard');
    }
  }
  return next();
}

// eslint-disable-next-line consistent-return
const authorisedPages = (req, res, next) => {
  const { isLoggedIn, data } = req.session;
  if (isLoggedIn) {
    if (data.userRole === 'ROL-EMPLOYER' && req.originalUrl === '/employer/dashboard') return next();
    if (data.userRole === 'ROL-EMPLOYEE' && req.originalUrl === '/employee/dashboard') return next();
    if ((data.userRole === 'ROL-ADMIN' || data.userRole === 'ROL-SUPERADMIN') && req.originalUrl === '/admin/dashboard') return  next();
  }
  res.redirect('/');
}

module.exports = { checkLoggedIn, authorisedPages }
