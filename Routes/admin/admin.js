const express = require('express');
const route = express.Router();
const { getAllAdmin, blockAdmin, unblockAdmin, deleteAdmin } = require('../../Controllers/admin/admin');

route.get('/all', getAllAdmin);
route.patch('/:userId/block', blockAdmin);
route.patch('/:userId/unblock', unblockAdmin);
route.patch('/:userId/delete', deleteAdmin);

module.exports = route;