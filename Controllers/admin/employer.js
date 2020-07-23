const sequelize = require('sequelize');
const model = require('../../Models/index');
const { renderPage } = require('../../Utils/render-page');

const op = sequelize.Op;

module.exports = {
  getEmployerActivity: async (userId) => {
    const Activity = await model.Activitylog.findAll({
      where: { userId },
    });
    return (Activity);
  },

  adminLogActivity: async (adminId, userId, message) => {
    const employer = model.Employer.findOne({
      where: { userId },
    })
    await model.Activitylog.create({
      message: `${message} ${employer.lastName} ${employer.firstName}` ,
      userId: adminId,
      ipAddress: '',
    });
  },

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
        if (employer.employer_type.toLowerCase() === 'individual') {
          individualsArray.push(employer.employer_type);
        }

        if (employer.employer_type.toLowerCase() === 'company') {
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
      const employerProfile = await model.Employer.findOne({
        where: { userId },
        include: [
          {
            model: model.User,
            include: [
              {
                model: model.Team,
                where: {
                  userId: { [op.col]: 'Employer.userId' },
                },
              },
            ],
          },
        ],
      });
      if (!employerProfile) {
        req.flash('error', 'Employer profile not found');
      }
      const employerActivity = await this.getEmployerActivity(userId);
      
      const data = {
        employerProfile,
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

      await this.adminLogActivity(req.session.userId, userId, 'Approved employer');

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

      await this.adminLogActivity(req.session.userId, userId, 'Disapproved employer');

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

      await this.adminLogActivity(req.session.userId, userId, 'Blocked employer');

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

      await this.adminLogActivity(req.session.userId, userId, 'unblocked employer');

      res.status(200).redirect('back');
    } catch (error) {
      console.log(error);
    }
  },
};
