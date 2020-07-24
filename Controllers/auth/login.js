/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const model = require('../../Models/index');
const {
  validateUserRequest,
} = require('../../Utils/validators/login-validator');
const { errorUserLogin } = require('../../Utils/response');

const getUserByEmail = (models, email) => {
  return models.User.findOne({ where: { email } });
};
const getEmployer = (models, user) => {
  return models.Employer.findOne({
    where: { userId: user.userId },
  });
};

const checkUserStatus = (req, res, email, password, user) => {
  if (!user) {
    return errorUserLogin(
      req,
      res,
      email,
      password,
      'Invalid email or password.',
    );
  }

  if (user.status === '0') {
    return errorUserLogin(req, res, email, password, 'User is not verified.');
  }

  if (user.block) {
    return errorUserLogin(
      req,
      res,
      email,
      password,
      'User Blocked! Please contact an administrator.',
    );
  }
};

const decryptPassword = (password, user) => {
  return bcrypt.compare(password, user.password);
};

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      validateUserRequest(req, res, email, password);

      const query = await getUserByEmail(model, email);

      const user = await query;

      // Check User - Blocked or Verified or Existing
      checkUserStatus(req, res, email, password, user);

      let verificationStatus = null;
      let isEmployer = false;

      // Get employer's verification status
      if (user.roleId === 'ROL-EMPLOYER') {
        isEmployer = true;
        const employer = await getEmployer(model, user);
        if (employer) {
          verificationStatus = employer.verificationStatus;
        }
      }

      // Decrypting User Password
      const valid = await decryptPassword(password, user);
      if (valid) {
        let data = {
          email: user.email,
          userId: user.userId.toString(),
          userRole: user.roleId,
        };

        if (isEmployer) data = { ...data, verificationStatus };

        req.session.data = data;
        req.session.createdAt = Date.now();
        req.session.isLoggedIn = true;

        // Role based redirections
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
        // In the event of a wrong password
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
      req.session.isLoggedIn = false;
      res.redirect('/');
    }
  },
};
