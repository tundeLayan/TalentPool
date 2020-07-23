
const employerSignup= (req, res) => {
  return res.render('auth/employerSignUp', {
    pageName: 'Employer Registration',
    path: '/employer/register',
  });
};

const employeeDashboard = async (req, res) => {
  return res.render('employee/employeeDashboard', {
    pageName: 'Employee Dashboard',
    path: '/employee/dashboard',
  })
}

module.exports = {
  employerSignup,
  employeeDashboard,
}