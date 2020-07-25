/* eslint-disable no-dupe-keys */
const { renderPage } = require('../../Utils/render-page');

const loginPage = (req, res) => {
  const { isLoggedIn } = req.session;

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
    pageName: 'Login',
    success,
    oldInput: {
      email: '',
      password: '',
    },
    validationErrors: [],
  };
  renderPage(res, 'auth/login', data, 'Login', '');
};

module.exports.loginPage = loginPage;
