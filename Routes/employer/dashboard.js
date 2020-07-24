const express = require('express');
const { dashboard, employerAddTeam } = require('../../Controllers/employer/dashboard');

const appRoute = express.Router();

/* GET Dashboard. */
appRoute.get('/', dashboard);
appRoute.get('/add-team', employerAddTeam);

module.exports = appRoute;
