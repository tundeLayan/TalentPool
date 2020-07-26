const db = require('../../Models');
const { allTeamMembers, team } = require('./team');
const { renderPage } = require('../../Utils/render-page');
const {
  getAllEmployee,
  getRecommendedInterns,
  getPendingHire,
  getTeamMember,
  getBEinTeam,
  getFEinTeam,
  getDesigninTeam,
  getMobileinTeam,
} = require('../dao/db-queries');

const dashboard = async (req, res) => {
  try {
    const allEmployee = await getAllEmployee(db);
    const recommendedInterns = await getRecommendedInterns(db);
    const pendingHire = await getPendingHire(req, db);
    const teamMember = await getTeamMember(req, db);
    const backEnd = await getBEinTeam(req, db);
    const frontEnd = await getFEinTeam(req, db);
    const design = await getDesigninTeam(req, db);
    const mobile = await getMobileinTeam(req, db);
    const data = { allEmployee, teamMember, recommendedInterns, pendingHire, backEnd, frontEnd, design, mobile };
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

// the main module
module.exports = {
  employerAddTeam: async (req, res) => {
    const data = await allTeamMembers(req);
    const teamName = await team(req);

    const pageData = {
      errorMessage: req.flash('error'),
      success: req.flash('success'),
      data,
      teamName,
    };
    return renderPage(res, 'employer/employerAddTeam', pageData, 'Team', '');
  },
  dashboard,
};
