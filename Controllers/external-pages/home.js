const { renderPage } = require('../../Utils/render-page');

const home = (req, res) => {
  const data = {
    message: 'This is a General Home Page',
    firstName: 'John',
    lastName: 'Doe'
  }
<<<<<<< HEAD
  renderPage(res, 'employer/employerProfileSettings', data, 'Demo Page')
=======
  renderPage(res, 'index', data, 'Demo Page')
>>>>>>> 9a6dcf5fa6192231ccf63163e43a49cf24693c3b
};

module.exports.home = home;
