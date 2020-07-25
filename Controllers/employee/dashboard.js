const { renderPage } = require('../../Utils/render-page');
const { getEmployee, getPortfolio, getSkills, addSkill } = require('../dao/db-queries/index');
const db = require('../../Models')

const dashboardHandler = async (req, res) =>{
  const employee = await getEmployee(db, req.session.userId);
  const portfolios = await getPortfolio(db, req.session.userId);
  const skills = await getSkills(db, req.session.userId);
  const data = { employee, portfolios, skills }
  renderPage(res, 'employee/employeeDashboard', data, 'Employee dashboard')
}

module.exports = { dashboardHandler };
