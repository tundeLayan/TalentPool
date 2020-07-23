const model = require('../../Models/index');
const { renderPage } = require('../../Utils/render-page');

module.exports = {
  approvedUsers: async () => {
    const approvedEmployers = await model.Employer.findAll({
      where: { verificationStatus: 'Approved' },
    });
    const approvedEmployees = await model.Employee.findAll({
      where: { verificationStatus: 'Approved' },
    });
    const totalApprovedUsers = approvedEmployers.length + approvedEmployees.length;
    return totalApprovedUsers;
  },

  disapprovedUsers: async () => {
    const disapprovedEmployers = await model.Employer.findAll({
      where: { verificationStatus: 'Disapproved' },
    });
    const disapprovedEmployees = await model.Employee.findAll({
      where: { verificationStatus: 'Disapproved' },
    });
    const totalDisapprovedUsers = disapprovedEmployers.length + disapprovedEmployees.length;
    return totalDisapprovedUsers;
  },

  getTableData: async (_modelName, activeStatus) => {
    const tableData = await model.modelName.findAll({
      where:{
        active: activeStatus
      },
    });
    return tableData;
  },

  dashboard: async (_req, res) => {
    try {
      const employers = await model.Employer.findAll({});
      const employees = await model.Employee.findAll({});

      const allTransactions = await model.Transaction.findAndCountAll({
        order: [
          ['id', 'DESC'],
        ],
      });
      const latestEmployers = await model.Employer.findAll({
        limit: 10,
        order: [
          ['id', 'DESC'],
        ],
      });
      const activeTransactions = await this.getTableData(Transaction, 1);
      const activeSubscriptions = await this.getTableData(Subscription, 1);
      
      const transactDetails = allTransactions.rows;
      const latestTransactions = allTransactions.rows.slice(0, 5);

      const totalApprovedUsers = await this.totalApprovedUsers();
      const totalDisapprovedUsers = await this.totaldisapprovedUsers();

      const data = {
        totalEmployer: employers,
        totalEmployee: employees,
        allTransactions: allTransactions.count,
        latestEmployers,
        latestTransactions,
        activeTransactions,
        transactDetails,
        activeSubscriptions,
        totalApprovedUsers,
        totalDisapprovedUsers,
      }
      res.status(200).json({
        status: 'success',
        data,
      });
      // renderPage(res, 'PageName', data, 'Admin | Dashboard', 'pathName');
    } catch (error) {
      console.log(error);
    }
  },
};