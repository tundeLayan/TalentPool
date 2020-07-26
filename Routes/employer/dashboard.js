const express = require('express');
const { dashboard } = require('../../Controllers/employer/dashboard');

const appRoute = express.Router();
// const { dashboardHandler } = require('../../Controllers/employer/dashboard');

appRoute.get('/', dashboard);

// appRoute.get('dashboard', dashboardHandler);
module.exports = appRoute;
