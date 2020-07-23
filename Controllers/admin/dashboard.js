const model = require('../../Models/index');

module.exports = {
  dashboard: async (req, res) => {
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
      const transactions = await model.Transaction.findAll({
        where: {
          active: 1,
        },
      });
      const subscriptions = await model.Subscription.findAll({
        where: {
          active: 1,
        },
      });
      const transactDetails = allTransactions.rows;
      const latestTransactions = allTransactions.rows.slice(0, 5);

      const totalApprovedUsers = await this.totalApprovedUsers();

      res.render('PageName', {
        pageName: 'Admin | Dashboard',
        path: '',
        totalEmployer: employers,
        totalEmployee: employees,
        allTransactions: allTransactions.count,
        latestEmployers,
        latestTransactions,
        activeTransactions: transactions.length,
        transactDetails,
        subscriptions,
        totalApprovedUsers,
      });
    } catch (error) {
      console.log(error);
    }
  },

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
};
