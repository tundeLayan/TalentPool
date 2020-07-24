/* eslint-disable consistent-return */
const { validationResult } = require('express-validator');
const { authErrorRedirect } = require('../response');

module.exports = {
  validateUserRequest: (req, res, email, password) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array()[0].msg;
      return authErrorRedirect(
        req,
        res,
        email,
        password,
        errorMessage,
        'auth/login',
        'Login',
        '/login',
      );
    }
  },
};
