const sequelize = require('sequelize');
const model = require('../../Models/index');
const { renderPage } = require('../../Utils/render-page');

const op = sequelize.Op;
  
module.exports = {
  verification: async (req, res) => {
    try {
      const  pendingVerifications = await model.Employer.findAll({
        where: {
          verificationStatus: 'Uploaded',
        },
        include:[
          {
            model: model.User,
            where:{
              userId:{ [op.col]: 'Employer.userId' },
            },
          },
        ],
      });

      const data = {
        pendingVerifications,
      }
      // res.status(200).json({
      // status: 'success',
      // data,
      // });
      renderPage(res, 'admin/adminDashboardVerification', data, 'Admin | Verification', 'pathName');
    } catch (error) {
        console.log(error);
    }
  },

  getEmployerDocument: async (req, res) => {
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
      // const employerDocuments = await getEmployerDocuments(userId);
      

      const data = {
        employerProfile,
        // employerDocuments,
        employer,
      }
      // res.status(200).json({
      //   status: 'success',
      //   data,
      // });
      renderPage(res, 'PageName', data, 'Admin | Employer profile', 'pathName');
    } catch (error) {
      console.log(error);
    }
  },
}