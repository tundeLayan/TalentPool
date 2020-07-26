const express = require('express');

const appRoute = express.Router();

const {
  sendInvite,
  removeEmployee,
  addTeam,
  viewTeam,
} = require('../../Controllers/employer/team');

appRoute.post('/add', sendInvite);
appRoute.get('/', viewTeam);
appRoute.post('/create', addTeam);
appRoute.get('/remove/employee', removeEmployee);

module.exports = appRoute;
