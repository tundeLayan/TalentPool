const { renderPage } = require('../../Utils/render-page');

const home = (req, res) => {
  const data = {
    message: 'This is a General Home Page',
    firstName: 'John',
    lastName: 'Doe',
    pageName: 'Home',
  };

  renderPage(res, './employer/employerDashboardProfile', data, 'Demo Page');
};

module.exports.home = home;
