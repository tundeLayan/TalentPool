const { validationResult } = require('express-validator');
const { errorUserLogin, errorAdminLogin } = require('../response');

const validateUserRequest = (req, res, email, password) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors.array()[0].msg;
    return errorUserLogin(req, res, email, password, errorMessage);
  }
};

const validateAdminRequest = (req, res, email, password) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array();
    const errorMessage = [];
    error.forEach((err) => errorMessage.push(err.msg));
    return errorAdminLogin(req, res, email, password, errorMessage);
  }
};

module.exports.validateUserRequest = validateUserRequest;
module.exports.validateAdminRequest = validateAdminRequest;