const express = require('express');
const employerController = require('../../Controllers/employer/employer-controller');

const route = express.Router();
route.post('/profile/create', employerController.create);

route.put('/logo/update', employerController.updateEmployerLogo);

route.put('/details/update', employerController.updateEmployerDetails);

route.get('/details', employerController.getEmployerDetails);

route.post('/document/upload', employerController.employerDocumentUpload);

route.get('/document', employerController.getEmployerDocument);

module.exports = route;
