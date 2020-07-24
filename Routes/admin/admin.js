const express = require('express');
const route = express.Router();
const { getAllAdmin, blockAdmin, unblockAdmin, deleteAdmin } = require('../../Controllers/admin/admin');

route.get('/all', getAllAdmin);
route.patch('/block/:userId', blockAdmin);
route.patch('/unblock/:userId', unblockAdmin);
route.delete('/delete/:userId', deleteAdmin);

module.exports = route;