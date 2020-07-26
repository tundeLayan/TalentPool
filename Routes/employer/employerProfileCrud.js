const express = require('express');
const employerController = require('../../Controllers/employer/employer-controller');

const route = express.Router();
route.post('/create', employerController.create);
route.put('/logo/update', employerController.updateEmployerLogo);
route.put('/basicinfo/update', employerController.updateEmployerBasicInfo);
route.put('/update', employerController.updateEmployerDetails);
route.post('/document/upload', employerController.employerDocumentUpload);
route.get('/document', employerController.getEmployerDocument);
route.get('/', employerController.getEmployerDetails);

module.exports = route;
