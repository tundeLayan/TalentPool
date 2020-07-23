const sequelize = require('sequelize');
const model = require('../../Models/index');
const { where } = require('sequelize');

const op = sequelize.Op;

const getAdmin = async function toFindOneFromUser(req, res) {
  const { userId } = req.params;
  const admin = await model.User.findOne({
    where: { userId },
    roleId: 'ROL-ADMIN',
  });
  return admin;
};

module.exports = {
	getAllAdmin: async (req, res) => {
		try {
			const admins = await model.User.findAll({
				where: { roleId: 'ROL_ADMIN' },
				include: [
          {
            model: model.Activitylog,
            where: {
              userId: { [op.col]: 'User.userId' },
            },
          },
        ],
			});
			
			const adminActivities = admins.map((admin) => {
				const activities = {
					name: admin.firstname,
					activity: admin.Activitylog
				}
				return activities;
			});

			res.status(500).render('pageName', {
				admins,
				adminActivities,
			});
		} catch (err) {
			res.status(500).redirect('back');
		}
	},

	blockAdmin: async (req, res) => {
    try {
      const user = await getAdmin(req, res);
      if (!user) res.status(404).redirect('back');

      user.block = 1;
      await user.save();
      res.redirect('/admin/all?msg=Employee blocked Successfully');
    } catch (err) {
      res.status(500).redirect('back');
    }
  },

  unblockAdmin: async (req, res) => {
    try {
      const user = await getAdmin(req, res);
      if (!user) res.status(404).redirect('back');

      user.block = 0;
      await user.save();
      res.redirect('/admin/all?msg=Employee unblocked Successfully');
    } catch (err) {
      res.status(500).redirect('back');
    }
	},
	
	deleteAdmin: async (req, res) => {
		try{
			const user = await getAdmin(req, res);
      if (!user) res.status(404).redirect('back');
			await user.destroy({ force: true });
			res.redirect('/admin/all?msg=Deleted Successfully');
		} catch(err) {
			res.status(500).redirect('back');
		}
	}
}