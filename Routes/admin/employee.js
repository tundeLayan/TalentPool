const express = require('express');
const route = express.Router();
const { 
    getAllEmployees, 
    getEmployeeFullDetails, 
    blockEmployee, 
    unblockEmployee,
    approveEmployee,
    disapproveEmployee,
} = require('../../Controllers/admin/employee');

route.get('/employees', getAllEmployees);
route.get('/employee/:userId', getEmployeeFullDetails);
route.patch('/employee/:userId/block', blockEmployee);
route.patch('/employee/:userId/block', unblockEmployee);
route.patch('/employee/:userId/approve', approveEmployee);
route.patch('/employee/:userId/disapprove', disapproveEmployee);


module.exports = route;