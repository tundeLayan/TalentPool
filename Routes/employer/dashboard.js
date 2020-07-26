const express = require('express');
const { dashboard } = require('../../Controllers/employer/dashboard');

const appRoute = express.Router();

appRoute.get('/', dashboard);

module.exports = appRoute;
