const model = require('../../Models');

const dashboard = async (req, res) => {
  try {
    const recommendedInterns = await model.Employee.findAll();
    const pendingHire = await model.Team.findAll({
      where: {
        // TODO: get the session data from auth
        userId: 1,
      },
    });
    const data = { recommendedInterns, pendingHire }
    res.render('employer/employerDashboard', { data, title: 'Employer Dashboard' });
  } catch (err) {
    const error = err;
    const { message } = err;
    res.render('error', { message, error });
  }
};
  
  module.exports.dashboard = dashboard;