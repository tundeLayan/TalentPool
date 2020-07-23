/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const model = require('../../Models/index');
const {
  validateUserRequest,
} = require('../../Utils/validators/login-validator');
const { errorUserLogin } = require('../../Utils/response');

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      validateUserRequest(req, res, email, password);

      const query = await model.User.findOne({ where: { email } });

      const user = await query;

      if (!user) {
        return errorUserLogin(
          req,
          res,
          email,
          password,
          'Invalid email or password.',
        );
      }

      // Getting the user type ID
      let verificationStatus = null;
      let isEmployer = false;

      if (user.roleId === 'ROL-EMPLOYER') {
        isEmployer = true;
        const employer = await model.Employer.findOne({
          where: { userId: user.userId },
        });
        if (employer) {
          verificationStatus = employer.verificationStatus;
        }
      }

      if (user.status === '0') {
        return errorUserLogin(
          req,
          res,
          email,
          password,
          'User is not verified',
        );
      }

      if (user.block) {
        return errorUserLogin(req, res, email, password, 'User Blocked!');
      }

      const currentUser = user;
      const valid = await bcrypt.compare(password, user.password);
      if (valid) {
        let data = {
          email: currentUser.email,
          userId: currentUser.userId.toString(),
          userRole: currentUser.roleId,
        };

        if (isEmployer) data = { ...data, verificationStatus };

        req.session.data = data;
        req.session.createdAt = Date.now();
        req.session.isLoggedIn = true;

        if (user.roleId === 'ROL-EMPLOYER') {
          req.session.employerId = user.userId;
          return res.redirect('/employer/dashboard');
        }
        if (user.roleId === 'ROL-EMPLOYEE') {
          req.session.employeeId = user.userId;
          return res.redirect(
            `/employee/dashboard/${user.userId}?success_message=Login Successful`,
          );
        }
        if (user.roleId === 'ROL-ADMIN' || user.roleId === 'ROL-SUPERADMIN') {
          req.session.isAdmin = true;
          req.session.adminId = user.userId;
          return res.redirect(
            '/admin/dashboard?message=Welcome, login successful!',
          );
        }
      } else {
        return errorUserLogin(
          req,
          res,
          email,
          password,
          'Invalid email or password.',
        );
      }
    } catch (err) {
      if (err) {
        return errorUserLogin(
          req,
          res,
          'Something Went Wrong! Please try again...',
        );
      }
    }
  },
  logout: (req, res) => {
    const { employeeId, employerId, adminId } = req.session;
    if (employerId || employeeId || adminId) {
      req.session = null;
      res.redirect('/login');
    }
  },
};
