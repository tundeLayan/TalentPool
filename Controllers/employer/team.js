/* eslint-disable no-await-in-loop */
const model = require('../../Models');

const URL =
  process.env.NODE_ENV === 'development'
    ? process.env.TALENT_POOL_DEV_URL
    : process.env.TALENT_POOL_FRONT_END_URL;

const sendEmail = require('../../Utils/send-email');
const { message } = require('../../Utils/team-invite-template');
const { renderPage } = require('../../Utils/render-page');
const { getEmployer } = require('../dao/db-queries');

const team = async (req) => {
  const { userId } = req.session;
  const { teamName } = await model.Employer.findOne({ where: { userId } });

  return teamName;
};

const allTeamMembers = async (req) => {
  const data = [];
  const { userId } = req.session;
  const teamMembers = await model.Team.findAll({
    where: { userId },
  });

  // Find data of each employee
  for (const singleEmployee of teamMembers) {
    const { firstName, lastName, email } = await model.User.findOne({
      where: { userId: singleEmployee.dataValues.employeeId },
    });

    const { image } = await model.Employee.findOne({
      where: { userId: singleEmployee.dataValues.employeeId },
    });

    data.push({
      employeeId: singleEmployee.dataValues.userId,
      image,
      name: `${firstName} ${lastName}`,
      email,
      status: `${singleEmployee.dataValues.status}`,
    });
  }
  return data;
};

module.exports = {
  sendInvite: async (req, res, next) => {
    const { userId } = req.session;
    const { email } = req.body;
    try {
      // Get all members of the employer's team
      const data = await allTeamMembers(req);

      const pageInfo = {
        errorMessage: req.flash('error'),
        success: req.flash('success'),
        data,
      };

      // Get employer details
      const employer = await model.User.findOne({
        where: { userId },
      });
      const employerData = await getEmployer(model, { userId });

      // Get employee details
      const employee = await model.User.findOne({
        where: { email, roleId: 'ROL-EMPLOYEE' },
      });
      if (!employee) {
        req.flash('error', 'User does not exist or is not an employee!');
        res.redirect('/employer/add-team');
      }
      const employeeData = await model.Employee.findOne({
        where: { userId: employee.userId },
      });

      if (!employeeData) {
        req.flash('error', 'User profile is not set-up');
        res.redirect('/employer/add-team');
      }

      if (employeeData.hasTeam === true) {
        pageInfo.errorMessage = req.flash(
          'error',
          'Employee is already in a team',
        );
        return renderPage(
          res,
          'employer/AddTeam',
          pageInfo,
          'Team',
          'employer/add-team',
        );
      }

      // Team specific actions
      const teamData = {
        teamName: employerData.teamName,
        userId,
        employeeId: employeeData.userId,
      };

      // Check if employee is in the team
      const isInTeam = await model.Team.findOne({
        where: { userId, employeeId: employeeData.userId },
      });
      if (!isInTeam) {
        await model.Team.create(teamData);
      } else {
        req.flash(
          'error',
          'User is already in or has been invited to this team',
        );
        res.redirect('/employer/add-team');
      }

      // Send email to user
      const inviteLink = `${URL}/team/verify-invite/?referralCode=${userId}&employee=${employeeData.userId}`;
      try {
        await sendEmail({
          email,
          subject: `${employer.firstName} ${employer.lastName} invited you to join the ${employerData.teamName} team on TalentHaven`,
          message: await message(inviteLink),
        });
      } catch (err) {
        req.flash('error', 'Invite link not sent. Please retry');
        res.redirect('/employer/add-team');
      }

      req.flash('success', 'Invite successfully sent');
      res.redirect('/employer/add-team');
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
    return false;
  },

  verifyInvite: async (req, res, next) => {
    const { referralCode, employee, response } = req.query;

    if (!referralCode || !employee || !response) {
      return renderPage(
        res,
        'external-pages/teamInvite',
        {
          result:
            "Whoops! Seems you tampered with the URL. We can't find some data. Please check your email again",
          pageName: 'Team Invite',
        },
        'Team Invite',
        '/team/verify-invite',
      );
    }
    try {
      // Check if the employee-employer record exists in the team
      const doesExist = await model.Team.findOne({
        where: { employeeId: employee, userId: referralCode },
      });
      if (!doesExist) {
        return renderPage(
          res,
          'external-pages/teamInvite',
          {
            result: 'Employer or employee does not exist',
            pageName: 'Team Invite',
          },
          'Team Invite',
          '/team/verify-invite',
        );
      }

      // Delete the record if the user rejects invite
      if (response === 'reject') {
        await model.Team.destroy({
          where: { employeeId: employee, userId: referralCode },
          force: true,
        });
        return renderPage(
          res,
          'external-pages/teamInvite',
          {
            result: "Sad to see you won't be a member of the team",
            pageName: 'Team Invite',
          },
          'Team Invite',
          '/team/verify-invite',
        );
      }

      // Check if the user is already in a team. An employee can be invited to many teams but should only belong to one
      const { hasTeam } = await model.Employee.findOne({
        where: { userId: employee },
      });
      if (hasTeam === true) {
        return renderPage(
          res,
          'external-pages/teamInvite',
          {
            result: "Whoops! You're already a member of a team",
            pageName: 'Team Invite',
          },
          'Team Invite',
          '/team/verify-invite',
        );
      }

      await model.Employee.update(
        { hasTeam: true },
        { where: { userId: employee } },
      );
      await model.Team.update(
        { status: 'Accepted' },
        { where: { employeeId: employee, userId: referralCode } },
      );

      return renderPage(
        res,
        'external-pages/teamInvite',
        {
          result: 'Congratulations! You have successfully joined the team',
          pageName: 'Team Invite',
        },
        'Team Invite',
        '/team/verify-invite',
      );
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  },

  addTeam: async (req, res) => {
    const { userId } = req.session;
    const { teamName } = req.body;
    const addTeam = await model.Employer.update(
      { teamName },
      { where: { userId } },
    );
    if (addTeam) {
      res.redirect('/employer/add-team');
    }
  },

  removeEmployee: async (req, res, next) => {
    try {
      const { employeeId } = req.query;

      const { userId } = req.session;

      await model.Employee.update(
        { hasTeam: false },
        { where: { employeeId } },
      );
      await model.Team.destroy({
        where: { userId, employeeId },
        force: true,
      });

      return res.redirect('/employer/add-team');
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  },
};

module.exports.allTeamMembers = allTeamMembers;
module.exports.team = team;
