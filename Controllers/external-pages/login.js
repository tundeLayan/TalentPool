const { renderPage } = require('../../Utils/render-page');

const login = (req, res) => {
  const { isLoggedIn, adminId, employeeId, employerId } = req.session;

  if (isLoggedIn && adminId) {
    res.redirect('/admin/dashboard');
  }

  const { passport } = req.session;

  if (req.session && !passport) {
    if (isLoggedIn && employeeId) {
      res.redirect(`/employee/dashboard/${employeeId}`);
    } else if (isLoggedIn && employerId) {
      res.redirect('/employer/dashboard');
    }
  }

  const success = req.flash('success');
  let message = req.flash('error');
  if (message.length > 0) {
    [message] = message;
  } else {
    message = null;
  }

  const data = {
    errorMessage: message,
    isLoggedIn,
    success,
    oldInput: {
      email: '',
      password: '',
    },
    validationErrors: [],
  };
  renderPage(res, 'auth/login', data, 'Login', '');
};

module.exports.login = login;
