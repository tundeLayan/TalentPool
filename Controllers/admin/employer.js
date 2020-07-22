const sequelize = require('sequelize');
const model = require('../../Models/index');

const op = sequelize.Op;

module.exports = {
  allEmployers: async (req, res) => {
    try {
      const employersAll = await model.Employer.findAll({});
      const individualsArray = [];
      const companyArray = [];
      const limit = Number(req.query.p) || Number(employersAll.length);
      const employers = await model.Employer.findAll({
        include: [
          {
            model: model.User,
            where: {
              userId: { [op.col]: 'Employer.userId' },
            },
          },
        ],
        limit,
        order: [
          ['id', 'DESC'],
        ],
      });

      const data = { data: employers };
      const totalEmployers = employersAll.length;
      employersAll.forEach((employer) => {
        if (employer.employer_type.toLowerCase() === 'individual') {
          individualsArray.push(employer.employer_type);
        }

        if (employer.employer_type.toLowerCase() === 'company') {
          companyArray.push(employer.employer_type);
        }
      });

      res.render('PageName', {
        pageName: 'Admin | All Employers',
        path: '',
        data,
        totalCompany: companyArray.length,
        totalIndividual: individualsArray.length,
        totalEmployers,
      });
    } catch (err) {
      console.log(err);
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
      res.redirect('back');
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
      res.redirect('back');
    } catch (error) {
      console.log(error);
    }
  },
};
