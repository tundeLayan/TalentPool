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

      // if (!employerProfile) {
      //   req.flash('error', 'Employer profile not found');
      // }

      const data = {
        pendingVerifications,
      }
      res.status(200).json({
      status: 'success',
      data,
      });
      //renderPage(res, 'PageName', data, 'Admin | Verification', 'pathName');
    } catch (error) {
        console.log(error);
    }
  },
}