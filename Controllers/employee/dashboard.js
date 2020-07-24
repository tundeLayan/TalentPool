const { renderPage } = require('../../Utils/render-page');

const dashboardHandler = async (req, res) =>{
  const data = {
    message: 'This is an example',
    firstName: 'John',
    lastName: 'Doe'
  }
  renderPage(res, 'employee/employeeDashboard', data, 'employee dashboard')
}

module.exports = { dashboardHandler };