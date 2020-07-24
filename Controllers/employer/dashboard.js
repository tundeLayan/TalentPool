/* eslint-disable prefer-const */
const db = require('../../Models');
const { allTeamMembers, team } = require('./team');
const { renderPage } = require('../../Utils/render-page');

/**
 * Get the team name for a given employer
 * @param {String} teamName - the user type id (employee_id) got from the session
 * @param {Object} model - The Team model object which is the Teams' table
 * @returns {Promise<String|null|Error>} - The count generated for the number of people in a team
 */
const teamFind = async (teamName, model) =>
  model.Employer.findOne({
    where: {
      teamName,
    },
  });

/**
 * Render a team page based on the fact that if a team count is 0 or more
 * @param {Object} req - request object from express
 * @param {Object} res - response object from express
 * @param {Object|null} teamName - Name of a team
 * @returns {Promise<*>} - Pages rendered
 */
const teamRender = async (req, res, teamName) => {
  const data = await allTeamMembers(req);
  console.log(data);

  const pageData = {
    errorMessage: req.flash('error'),
    success: req.flash('success'),
    data,
  };
  if (!teamName.dataValues.teamName) {
    return renderPage(
      res,
      'employer/createTeam',
      pageData,
      'Add Team',
      'employer/add-team',
    );
  }
  renderPage(res, 'employer/AddTeam', pageData, 'Team', '');
};

// the main module
module.exports = {
  employerAddTeam: async (req, res) => {
    const employerTeam = await team(req, res);
    const countTeam = await teamFind(employerTeam, db);
    await teamRender(req, res, countTeam);
  },
};
