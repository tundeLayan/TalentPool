const express = require('express');

const appRoute = express.Router();

const {
  sendInvite,
  removeEmployee,
  addTeam,
} = require('../../Controllers/employer/team');

appRoute.post('/add-team', sendInvite);
appRoute.post('/team/create', addTeam);
appRoute.get('/remove-employee', removeEmployee);

module.exports = appRoute;
