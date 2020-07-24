
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

const login = async (req, res) => {
  return res.render('auth/login', {
    pageName: 'login',
    path: '/login'
  })
}
module.exports = {
  employerSignup,
  employeeDashboard,
  login,
}