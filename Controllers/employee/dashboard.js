const { renderPage } = require('../../Utils/render-page');
const { getEmployee, getPortfolio, getSkills, addSkill } = require('../dao/db-queries/index');
const db = require('../../Models')

const dashboardHandler = async (req, res) =>{
  const employee = await getEmployee(db, 'a52867c3-000c-4102-bbc2-10b1a9041e62');
  const portfolios = await getPortfolio(db, 'a52867c3-000c-4102-bbc2-10b1a9041e62');
  const skills = await getSkills(db, 'a52867c3-000c-4102-bbc2-10b1a9041e62');
  const data = { employee, portfolios, skills }
  renderPage(res, 'employee/employeeDashboard', data, 'Employee dashboard')
}

module.exports = { dashboardHandler };
