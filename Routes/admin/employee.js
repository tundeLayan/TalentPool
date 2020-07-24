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

route.get('/all/employees', getAllEmployees);
route.get('/employee/:userId', getEmployeeFullDetails);
route.patch('/employee/block/:userId', blockEmployee);
route.patch('/employee/unblock/:userId', unblockEmployee);
route.patch('/employee/approve/:userId', approveEmployee);
route.patch('/employee/disapprove/:userId', disapproveEmployee);


module.exports = route;