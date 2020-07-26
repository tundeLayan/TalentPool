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
const authorisedPages = (role, roleSuperAdmin = null) =>  (req, res, next) => {
  const { isLoggedIn, data } = req.session;
  if (isLoggedIn && data && data.userRole === role) return next();
  if (isLoggedIn && data && roleSuperAdmin && data.userRole === roleSuperAdmin) return next();
  res.redirect('/login');
}

module.exports = { checkLoggedIn, authorisedPages }
