const { renderPage } = require('../Utils/render-page');

const demoThree = (req, res) => {
  const data = {
    message: 'This is a Another Page',
    firstName: 'John',
    lastName: 'Doe'
  }
  renderPage(res, 'index', data, 'Another Page')
};

const demoThreeId = (req, res) => {
  const { id } = req.params;
  const data = {
    message: `This is Another Page with id of ${id}`,
    firstName: 'John',
    lastName: 'Doe'
  }
  renderPage(res, 'index', data, 'Another Page')
};

module.exports = {
  demoThree,
  demoThreeId,
};
