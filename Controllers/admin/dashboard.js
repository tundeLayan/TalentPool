const model = require('../../Models/index');
const { renderPage } = require('../../Utils/render-page');

const approvedUsers = async () => {
  const approvedEmployers = await model.Employer.findAll({
    where: { verificationStatus: 'Approved' },
  });
  const approvedEmployees = await model.Employee.findAll({
    where: { verificationStatus: 'Approved' },
  });
  const totalApprovedUsers = approvedEmployers.length + approvedEmployees.length;
  return totalApprovedUsers;
};

const disapprovedUsers = async () => {
  const disapprovedEmployers = await model.Employer.findAll({
    where: { verificationStatus: 'Disapproved' },
  });
  const disapprovedEmployees = await model.Employee.findAll({
    where: { verificationStatus: 'Disapproved' },
  });
  const totalDisapprovedUsers = disapprovedEmployers.length + disapprovedEmployees.length;
  return totalDisapprovedUsers;
};

const getActiveSubscription = async (activeStatus) => {
  const activeSubscription = await model.Subscription.findAll({
    where:{
      active: activeStatus
    },
  });
  return activeSubscription;
};

module.exports = {
  dashboard: async (req, res) => {
    try {
      const employers = await model.Employer.findAll({});
      const employees = await model.Employee.findAll({});

      const allSubscriptions = await model.Subscription.findAll({
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

      const activeSubscriptions = await getActiveSubscription(1);
      const totalApprovedUsers = await approvedUsers();
      const totalDisapprovedUsers = await disapprovedUsers();
      const latestSubscriptions = allSubscriptions.slice(0, 5);
      
      const data = {
        totalEmployer: employers,
        totalEmployee: employees,
        allSubscriptions: allSubscriptions.length,
        latestEmployers,
        latestSubscriptions,
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