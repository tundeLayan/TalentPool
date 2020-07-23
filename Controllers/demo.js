const { renderPage } = require('../Utils/render-page');

const demo = (req, res) => {
  const data = {
    message: 'This is an example',
    firstName: 'John',
    lastName: 'Doe'
  }
  renderPage(res, 'index', '/', 'Demo Page', data)
};

module.exports.demo = demo;
