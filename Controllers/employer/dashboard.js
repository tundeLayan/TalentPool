const models = require('../../Models/index');
const { getAllEmployee, getRecommendedInterns, getPendingHire, getTeamMember} = require('../dao/db-queries');

const dashboard = async (req, res) => {
  try {
    const allEmployee = getAllEmployee(models);
    const recommendedInterns = getRecommendedInterns(models);
    const pendingHire = getPendingHire(req, models);
    const teamMember = getTeamMember(req, models);
    const data = { allEmployee, teamMember, recommendedInterns, pendingHire }
    res.render('employer/employerDashboard', { data, title: 'Employer Dashboard' });
  } catch (err) {
    const error = err;
    const { message } = err;
    res.render('error', { message, error });
  }
};
  
  module.exports.dashboard = dashboard;