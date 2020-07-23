const model = require('../../Models');

let user = '';

const recommendedInterns = model.Employee.findAll({
  where: {
    userType: 'HNG',
    verificationStatus: 'Approved'
  }
});
const allEmployee = model.Employee.findAll({
  where: {
    verificationStatus: 'Approved'
  }
});
const pendingHire = model.Team.findAll({
  where: {
    userId: user,
    status: 'Pending'
  },
});
const teamMember = model.Team.findAll({
  where: {
    userId: user,
    status: 'Accepted'
  },
});

const dashboard = async (req, res) => {
  try {
    user = req.session.id;
    const data = { allEmployee, teamMember, recommendedInterns, pendingHire }
    res.render('employer/employerDashboard', { data, title: 'Employer Dashboard' });
  } catch (err) {
    const error = err;
    const { message } = err;
    res.render('error', { message, error });
  }
};
  
  module.exports.dashboard = dashboard;