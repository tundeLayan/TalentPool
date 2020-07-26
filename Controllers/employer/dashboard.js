const db = require('../../Models');
const { renderPage } = require('../../Utils/render-page');
const {
  getAllEmployee,
  getRecommendedInterns,
  getPendingHire,
  getTeamMember,
} = require('../dao/db-queries');

const dashboard = async (req, res) => {
  try {
    const allEmployee = await getAllEmployee(db);
    const recommendedInterns = await getRecommendedInterns(db);
    const pendingHire = await getPendingHire(req, db);
    const teamMember = await getTeamMember(req, db);
    const data = { allEmployee, teamMember, recommendedInterns, pendingHire };
    renderPage(
      res,
      'employer/employerDashboard',
      data,
      'TalentPool | Employer Dashboard',
      '/employer/dashboard',
    );
  } catch (err) {
    const error = err;
    const { message } = err;
    res.render('error', { message, error });
  }
};

const dashboardHandler = async (req, res) => {
  const data = {
    message: 'This is an example',
    firstName: 'John',
    lastName: 'Doe',
  };
  renderPage(res, 'employer/employerDashboard', data, 'employer dashboard');
};

// the main module
module.exports = {
  dashboardHandler,
  dashboard,
};
