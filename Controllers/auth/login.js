/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const model = require('../../Models/index');
const {
  validateUserRequest,
} = require('../../Utils/validators/login-validator');
const { authErrorRedirect } = require('../../Utils/response');
const { getUserByEmail, getEmployer } = require('../dao/db-queries');
const redis = require('../dao/impl/redis/redis-client');
const redisKeys = require('../dao/impl/redis/redis-key-gen');

const client = redis.getClient();

const checkUserStatus = (req, res, email, password, user) => {
  if (!user) {
    return authErrorRedirect(
      req,
      res,
      email,
      password,
      'Invalid email or password.',
      'auth/login',
      'Login',
      '/login',
    );
  }

  if (user.status === '0') {
    return authErrorRedirect(
      req,
      res,
      email,
      password,
      'Access Denied. Please contact an admnistrator.',
      'auth/login',
      'Login',
      '/login',
    );
  }

  if (user.block) {
    return authErrorRedirect(
      req,
      res,
      email,
      password,
      'User Blocked! Please contact an administrator.',
      'Invalid email or password.',
      'auth/login',
      'Login',
      '/login',
    );
  }
};

const decryptPassword = (password, user) => {
  if (!user) return false;
  return bcrypt.compareSync(password, user.password);
};

const redirectUser = async (req, res, email, password, user) => {
  let verificationStatus = null;
  let isEmployer = false;
  if (!user) {
    return authErrorRedirect(
      req,
      res,
      email,
      password,
      'Invalid email or password.',
      'auth/login',
      'Login',
      '/login',
    );
  }
  // Check User - Blocked or Verified or Existing
  checkUserStatus(req, res, email, password, user);
  // Get employer's verification status
  if (user && user.roleId === 'ROL-EMPLOYER') {
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
      userName: user.firstName,
    };

    if (isEmployer) {
      data = {
        ...data,
        verificationStatus,
      };
    }

    req.session.data = data;
    req.session.createdAt = Date.now();
    req.session.isLoggedIn = true;

    // Role based redirections
    if (user && user.roleId === 'ROL-EMPLOYER') {
      req.session.employerId = user.userId;
      return res.redirect('/employer/dashboard');
    }
    if (user && user.roleId === 'ROL-EMPLOYEE') {
      req.session.employeeId = user.userId;
      return res.redirect('/employee/dashboard');
    }
    if (user && (user.roleId === 'ROL-ADMIN' || user.roleId === 'ROL-SUPERADMIN')) {
      req.session.isAdmin = true;
      req.session.adminId = user.userId;
      return res.redirect(
        '/admin/dashboard',
      );
    }
   
  } else {
    // In the event of a wrong password
    return authErrorRedirect(
      req,
      res,
      email,
      password,
      'Invalid email or password.',
      'auth/login',
      'Login',
      '/login',
    );
  }
};

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      validateUserRequest(req, res, email, password);
      let user;
      const keyId = redisKeys.getHashKey(email.toString());
      client.get(keyId, async (err, data) => {
        user = JSON.parse(data);
        if (user) {
          return redirectUser(req, res, email, password, user);
        }
        const userData = await getUserByEmail(model, email);
        if (userData) {
          user = userData.dataValues;
          client.set(keyId, JSON.stringify(user));
        }
        await redirectUser(req, res, email, password, user);
      });

    } catch (err) {
      if (err) {
        return authErrorRedirect(
          req,
          res,
          null,
          null,
          'Something Went Wrong! Please try again...',
          'auth/login',
          'Login',
          '/login',
        );
      }
    }
  },
  logout: (req, res) => {
    if (req.session.isLoggedIn) {
      req.session = null;
    }
    res.redirect('/login');
  },
};
