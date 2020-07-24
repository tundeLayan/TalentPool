const { renderPage } = require('../../Utils/render-page');

const about = (req, res) => {
  const data = {
    message: 'This is a About Page',
    firstName: 'John',
    lastName: 'Doe',
  };
  renderPage(res, 'index', data, 'Demo Page');
};

module.exports.about = about;
