const { renderPage } = require('../../Utils/render-page');

const demoTwo = (req, res) => {
  const data = {
    message: 'This is Employee Profile Page',
    firstName: 'John',
    lastName: 'Doe'
  }
  renderPage(res, 'index', data, 'Profile Page')
};

const demoTwoId = (req, res) => {
  const { id } = req.params;
  const data = {
    message: `This is Employee Profile Page with id of ${id}`,
    firstName: 'John',
    lastName: 'Doe'
  }
  renderPage(res, 'index', data, 'Profile Page')
};

module.exports = {
  demoTwo,
  demoTwoId,
};
