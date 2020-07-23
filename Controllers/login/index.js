/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const model = require('../../Models/index');
const {
  validateUserRequest,
  validateAdminRequest,
} = require('../../Utils/validators/login-validator');
const { errorUserLogin, errorAdminLogin } = require('../../Utils/response');

module.exports = {
  userLogin: async (req, res, next) => {
    const { email, password } = req.body;
    let currentUser;

    validateUserRequest(req, res, email, password);

    model.User.findOne({ where: { email } })
      .then(async (user) => {
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
        let userTypeId = null;
        let verificationStatus = null;
        let isEmployer = false;

        if (user.roleId === 'ROL-EMPLOYEE') {
          const employee = await model.Employee.findOne({
            where: { userId: user.userId },
          });
          if (employee) {
            userTypeId = employee.userId;
          }
        } else if (user.roleId === 'ROL-EMPLOYER') {
          isEmployer = true;
          const employer = await model.Employer.findOne({
            where: { userId: user.userId },
          });
          if (employer) {
            userTypeId = employer.userId;
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

        currentUser = user;
        bcrypt
          .compare(password, user.password)
          .then((valid) => {
            if (valid) {
              let data = {
                email: currentUser.email,
                userId: currentUser.userId.toString(),
                userRole: currentUser.roleId,
                userTypeId,
              };

              if (isEmployer) data = { ...data, verificationStatus };

              req.session.data = data;
              req.session.createdAt = Date.now();
              req.session.isLoggedIn = true;
              req.session.employerId = data.userTypeId;

              if (user.role_id === 'ROL-EMPLOYER')
                return res.redirect('/employer/dashboard');

              return res.redirect(
                `/employee/dashboard/${data.userTypeId}?success_message=Login Successful`,
              );
            }
            return errorUserLogin(
              req,
              res,
              email,
              password,
              'Invalid email or password.',
            );
          })
          .catch(() => {
            res.redirect('/login');
          });
      })
      .catch((err) => {
        if (!err.statusCode) {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        }
        next(err);
      });
  },
  adminLogin: async (req, res, next) => {
    const { email, password } = req.body;
    validateAdminRequest(req, res, email, password);
    model.User.findOne({
      where: {
        email,
      },
    })
      .then(async (user) => {
        if (!user) {
          return errorAdminLogin(
            req,
            res,
            email,
            password,
            'Incorrect login details,user does not exist.',
          );
        }
        if (user.roleId !== 'ROL-ADMIN' && user.roleId !== 'ROL-SUPERADMIN') {
          return errorAdminLogin(
            req,
            res,
            email,
            password,
            'User is not an admin.',
          );
        }
        let userTypeId = null;
        const admin = await model.Admin.findOne({
          where: {
            userId: user.userId,
          },
        });

        if (admin) {
          userTypeId = admin.userId;
          req.session.name = `${admin.firstName} ${admin.lastName}`;
        }

        if (user.status === '0') {
          return errorAdminLogin(
            req,
            res,
            email,
            password,
            'User is not verified.',
          );
        }
        if (user.block) {
          return errorAdminLogin(req, res, email, password, 'User is blocked.');
        }
        bcrypt
          .compare(password, user.password)
          .then((valid) => {
            if (valid) {
              const data = {
                email: user.email,
                userRole: user.roleId,
                userTypeId,
              };
              req.session.data = data;
              req.session.isLoggedIn = true;
              req.session.userId = user.userId;
              req.session.createdAt = Date.now();
              req.session.adminId = userTypeId;
              res.redirect(
                '/admin/dashboard?message=Welcome, login successful!',
              );
            }
            return errorAdminLogin(
              req,
              res,
              email,
              password,
              'Incorrect login details',
            );
          })
          .catch(() => {
            res.redirect('/admin/login');
          });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  },
  postLogout: (req, res) => {
    const { employeeId, employerId } = req.session;
    if (employerId || employeeId) {
      req.session = null;
      res.redirect('/login');
    } else {
      req.session = null;
      res.redirect('/admin/login');
    }
  },
};
