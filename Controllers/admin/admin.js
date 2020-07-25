const { renderPage } = require('../../Utils/render-page');
const { getAdmin, activityLog, allAdmin } = require('../dao/db-queries');

module.exports = {
	getAllAdmin: async (req, res) => {
		try {
      const admins = await allAdmin()
      const data = { admins }
      renderPage(res, 'admin/adminList', data, 'Talent Haven | Admin List', 'adminList')
		} catch (err) {
			res.status(500).redirect('back');
		}
  },

  getAdminFullDetails: async (req, res) => {
    const { userId } = req.params;
    const admin = await getAdmin(userId);
    const adminAcitvites = await activityLog();
    const data = {
      admin,
      adminAcitvites,
    }
    renderPage(res, 'Talent Haven | Admin Profile', data, 'adminList');
  },
	blockAdmin: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await getAdmin(userId);
      if (!user) res.status(404).redirect('back');

      user.block = 1;
      await user.save();
      res.redirect('/admin/all?msg=Admin blocked Successfully');
    } catch (err) {
      res.status(500).redirect('back');
    }
  },

  unblockAdmin: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await getAdmin(userId);
      if (!user) res.status(404).redirect('back');

      user.block = 0;
      await user.save();
      res.redirect('/admin/all?msg=Admin Unblocked Successfully');
    } catch (err) {
      res.status(500).redirect('back');
    }
	},

}