const { renderPage } = require('../Utils/render-page');

const demo = (req, res) => {
  const data = {
    message: 'This is a General Home Page',
    firstName: 'John',
    lastName: 'Doe'
  }
  renderPage(res, 'index', data, 'Demo Page')
};

module.exports.demo = demo;
