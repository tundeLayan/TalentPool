const express = require('express');
const { validateLogin } = require('../../../Utils/validators/auth-validator');
const authController = require('../../../Controllers/auth');

const appRoute = express.Router();

appRoute.post(
  '/user/login',
  validateLogin,
  authController.userLogin,
);
appRoute.post(
    '/admin/login',
    validateLogin,
    authController.adminLogin,
  );

module.exports = appRoute;