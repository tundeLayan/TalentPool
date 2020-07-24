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

const getAllUsers = async () => {
  const allUsers = await model.User.findAll({});
  return allUsers;
};

const getAllEmployers = async () => {
  const allEmployers = await model.Employer.findAll({});
  return allEmployers;
};

const getPendingEmployees = async () => {
  const pendingEmployees = await model.Employee.findAll({
    where: {
      verificationStatus: 'Pending',
    },
  });
  return pendingEmployees.length;
};

const filterData = (data, value, key) => {
  let filteredData;
  if(key === 'roleId') { filteredData = data.filter( (myData) => { 
      return myData.roleId === value; 
    });
  }
  if(key === 'block'){ filteredData = data.filter( (myData) => { 
      return myData.block === value; 
    });
  }
  if(key === 'teamName'){ filteredData = data.filter( (myData) => { 
      return myData.teamName === value; 
    });
  }
  if(key === 'active'){ filteredData = data.filter( (myData) => { 
      return myData.active === value; 
    });
  }
  if(key === 'verificationStatus'){ filteredData = data.filter( (myData) => { 
    return myData.verificationStatus === value; 
  });
}
  return filteredData;
};

module.exports = {
  dashboard: async (req, res) => {
    try {
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
      
      const unactiveSubscriptions = filterData(allSubscriptions, false, 'active');
      const activeSubscriptions = filterData(allSubscriptions, true, 'active');
      const totalApprovedUsers = await approvedUsers();
      const totalDisapprovedUsers = await disapprovedUsers();
      const allUsers = await getAllUsers();
      const pendingEmployees = await getPendingEmployees();
      const allEmployers =  await getAllEmployers();
      
      const employees = filterData(allUsers, 'ROL-EMPLOYEE', 'roleId');
      const unactiveUsers = filterData(allUsers, true, 'block');
      const employers = filterData(allUsers, 'ROL-EMPLOYER', 'roleId');
      const hasNoTeam = filterData(employers, '', 'teamName');
      

      const latestSubscriptions = allSubscriptions.slice(0, 5);
      const totalTeams = employers.length - hasNoTeam;
      const pendingEmployers = filterData(allEmployers, 'Pending','verificationStatus');
      const uploadedEmployers = filterData(allEmployers, 'Uploaded','verificationStatus');
      const pendingReviews =  pendingEmployees + pendingEmployers.length + uploadedEmployers.length;
      
      

      const data = {
        totalEmployer: employers,
        totalEmployee: employees,
        allSubscriptions: allSubscriptions.length,
        latestEmployers,
        latestSubscriptions,
        activeSubscriptions,
        unactiveSubscriptions,
        totalApprovedUsers,
        totalDisapprovedUsers,
        totalTeams,
        unactiveUsers,
        allUsers,
        pendingReviews,
        uploadedEmployers,
      }

      renderPage(res, 'admin/adminDashboard', data, 'Admin | Dashboard', 'pathName');
    } catch (error) {
      console.log(error);
    }
  },
};