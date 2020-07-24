const sequelize = require('sequelize');
const model = require('../../Models/index');
const { renderPage } = require('../../Utils/render-page');

const op = sequelize.Op;

const getEmployerActivity = async (userId) => {
  const Activity = await model.Activitylog.findAll({
    where: { userId },
  });
  return (Activity);
};

const adminLogActivity = async (adminId, userId, message) => {
  const testId = 'c6a3a120-354c-4e31-8012-b6bccb48997c';
  const employer = await model.User.findOne({
    where: { userId },
  })
  await model.Activitylog.create({
    message: `${message} ${employer.lastName} ${employer.firstName}` ,
    userId: testId,
    ipAddress: '',
  });
};

const getEmployerDocuments = async (userId) => {
  const employerDocument = await model.EmployerDocument.findAll({
    where: { userId },
  });
  return (employerDocument);
};

module.exports = {
  allEmployers: async (req, res) => {
    try {
      const employersAll = await model.Employer.findAll({});
      const individualsArray = [];
      const companyArray = [];

      const employers = await model.Employer.findAll({
        include: [
          {
            model: model.User,
            where: {
              userId: { [op.col]: 'Employer.userId' },
            },
          },
        ],
        order: [
          ['id', 'DESC'],
        ],
      });

      const totalEmployers = employersAll.length;
      employersAll.forEach((employer) => {
        if (employer.employerType.toLowerCase() === 'individual') {
          individualsArray.push(employer.employer_type);
        }

        if (employer.employerType.toLowerCase() === 'company') {
          companyArray.push(employer.employer_type);
        }
      });

      const data = {
        employers,
        totalCompany: companyArray.length,
        totalIndividual: individualsArray.length,
        totalEmployers,
      }
      res.status(200).json({
        status: 'success',
        data,
      });
      //renderPage(res, 'PageName', data, 'Admin | All Employers', 'pathName');
    } catch (err) {
      console.log(err);
    }
  },

  getEmployerProfile: async (req, res) => {
    try {
      const { userId } = req.params;
      const employerProfile = await model.Team.findAll({
        include: [
          {
            model: model.User,
            where: {
              userId: { [op.col]: 'Team.userId' }, 
            },
          },
        ],
      });
      const employer = await model.Employer.findOne({ where: { userId } });
      const employerActivity = await getEmployerActivity(userId);
      const employerDocuments = await getEmployerDocuments(userId);
      
      // if (!employerProfile) {
      //   req.flash('error', 'Employer profile not found');
      // }
      

      const data = {
        employerProfile,
        employerDocuments,
        employer,
        employerActivity,
      }
      res.status(200).json({
        status: 'success',
        data,
      });
      //renderPage(res, 'PageName', data, 'Admin | Employer profile', 'pathName');
    } catch (error) {
      console.log(error);
    }
  },

  approveEmployer: async (req, res) => {
    try {
      const { userId } = req.params;
      const verify = { verificationStatus: 'Approved' };

      const result = await model.Employer.update(verify, {
        where: { userId },
        returning: true,
        plain: true,
      });
      if (!result) {
        req.flash('error', 'Employer verification status not updated');
      }

      await adminLogActivity(req.session.userId, userId, 'Approved employer');

      res.status(200).redirect('back');
    } catch (error) {
      console.log(error);
    }
  },

  disapproveEmployer: async (req, res) => {
    try {
      const { userId } = req.params;
      const verify = { verificationStatus: 'Disapproved' };

      const result = await model.Employer.update(verify, {
        where: { userId },
        returning: true,
        plain: true,
      });
      if (!result) {
        req.flash('error', 'Employer verification status not updated');
      }

      await adminLogActivity(req.session.userId, userId, 'Disapproved employer');

      res.status(200).redirect('back');
    } catch (error) {
      console.log(error);
    }
  },

  blockEmployer: async (req, res) => {
    try {
      const { userId } = req.params;
      const block = { block: 1 };

      const result = await model.User.update(block, {
        where: { userId },
      });
      if (!result) {
        req.flash('error', 'Employer block status not updated');
      }

      await adminLogActivity(req.session.userId, userId, 'Blocked employer');

      res.status(200).redirect('back');
    } catch (error) {
      console.log(error);
    }
  },

  unblockEmployer: async (req, res) => {
    try {
      const { userId } = req.params;
      const block = { block: 0 };

      const result = await model.User.update(block, {
        where: { userId },
      });
      if (!result) {
        req.flash('error', 'Employer block status not updated');
      }

      await adminLogActivity(req.session.userId, userId, 'unblocked employer');

      res.status(200).redirect('back');
    } catch (error) {
      console.log(error);
    }
  },
};
