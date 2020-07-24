const models = require('../../Models/index');
const { renderPage } = require('../../Utils/render-page');
const { getAllEmployee, getRecommendedInterns, getPendingHire, getTeamMember} = require('../dao/db-queries');

const dashboard = async (req, res) => {
  try {
    const allEmployee = await getAllEmployee(models);
    const recommendedInterns = await getRecommendedInterns(models);
    const pendingHire = await getPendingHire(req, models);
    const teamMember = await getTeamMember(req, models);
    const data = { allEmployee, teamMember, recommendedInterns, pendingHire }
    renderPage(res ,'employer/employerDashboard',data,'TalentPool | Employer Dashboard','/employer/dashboard' )
  } catch (err) {
    const error = err;
    const { message } = err;
    res.render('error', { message, error });
  }
};
  
  module.exports.dashboard = dashboard;