const { renderPage } = require('../../Utils/render-page');
const { getEmployee, getPortfolio, getSkills } = require('../dao/db-queries/index');
const db = require('../../Models')

const dashboardHandler = async (req, res) =>{
  const employee = await getEmployee(db, req.session.userId);
  const portfolio = await getPortfolio(db, req.session.userId);
  const skills = await getSkills(db, req.session.userId)
  const data = { employee, portfolio, skills }
  renderPage(res, 'employee/employeeDashboard', data, 'Employee dashboard')
}

module.exports = { dashboardHandler };
