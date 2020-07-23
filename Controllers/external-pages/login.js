const { renderPage } = require('../../Utils/render-page');

const login = (req, res) => {
  const data = {
    message: 'Login Here',
  };
  renderPage(res, 'login', data, 'Login');
};

module.exports.login = login;
