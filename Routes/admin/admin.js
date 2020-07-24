const express = require('express');
const route = express.Router();
const { getAllAdmin, blockAdmin, unblockAdmin, getAdminFullDetails } = require('../../Controllers/admin/admin');

route.get('/all', getAllAdmin);
route.get('/profile/:userId', getAdminFullDetails);
route.patch('/block/:userId', blockAdmin);
route.patch('/unblock/:userId', unblockAdmin);
route.get('/dash', function(req, res) {
    res.render('admin/adminDashboard');
})

module.exports = route;