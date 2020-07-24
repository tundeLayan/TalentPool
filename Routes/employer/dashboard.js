const express = require('express');

const appRoute = express.Router();
const { employerAddTeam } = require('../../Controllers/employer/dashboard');
const { dashboardHandler } = require('../../Controllers/employer/dashboard');

appRoute.get('/add-team', employerAddTeam);

appRoute.get('dashboard', dashboardHandler);
module.exports = appRoute;
