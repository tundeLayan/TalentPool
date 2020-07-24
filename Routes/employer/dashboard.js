const express = require('express');

const appRoute = express.Router();
const { employerAddTeam } = require('../../Controllers/employer/dashboard');

appRoute.get('/add-team', employerAddTeam);

module.exports = appRoute;
