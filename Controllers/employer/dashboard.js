const model = require('../../Models');

const dashboard = async (req, res) => {
  try {
    const recommendedInterns = await model.Employee.findAll({
      where: {
        userType: 'HNG',
        verificationStatus: 'Approved'
      }
    });
    const allEmployee = await model.Employee.findAll({
      where: {
        verificationStatus: 'Approved'
      }
    });
    const pendingHire = await model.Team.findAll({
      where: {
        userId: req.session.userId,
        status: 'Pending'
      },
    });
    const teamMember = await model.Team.findAll({
      where: {
        userId: req.session.userId,
        status: 'Accepted'
      },
    });
    const data = { allEmployee, teamMember, recommendedInterns, pendingHire }
    res.render('employer/employerDashboard', { data, title: 'Employer Dashboard' });
  } catch (err) {
    const error = err;
    const { message } = err;
    res.render('error', { message, error });
  }
};
  
  module.exports.dashboard = dashboard;