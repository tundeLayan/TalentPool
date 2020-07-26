const moment = require('moment');
const { renderPage } = require('../../Utils/render-page');
const { getAllUploadedEmployers, getAllEmployerDocuments, getFullEmployerProfileByUserId, } = require('../dao/db-queries');

  
module.exports = {
  verification: async (req, res) => {
    try {
      const  pendingVerifications = await getAllUploadedEmployers();

      const data = {
        pendingVerifications,
        moment,
      }
      renderPage(res, 'admin/adminDashboardVerification', data, 'Admin | Verification', 'pathName');
    } catch (error) {
        console.log(error);
    }
  },

  getEmployerDocument: async (req, res) => {
    try {
      const { userId } = req.params;
      const employerDocuments = await getAllEmployerDocuments(userId);
      const employerProfile = await getFullEmployerProfileByUserId(userId);

      const data = {
        employerDocuments,
        employerProfile,
        moment,
      }
      renderPage(res, 'admin/adminDashboardVerificationSingular', data, 'Admin | Employer verification', 'pathName');
    } catch (error) {
      console.log(error);
    }
  },
}