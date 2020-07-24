const sequelize = require('sequelize');
const uuid = require('uuidV4');
const bcrypt = require('bcryptjs');
const model = require('../../Models/index');
const render = require('../../Utils/render-page');

const op = sequelize.Op;

const getAdmin = async function toFindOneFromUser(userId) {
  const admin = await model.User.findOne({
    where: { userId },
    roleId: 'ROL-ADMIN',
  });
  return admin;
};

module.exports = {
	getAllAdmin: async (req, res) => {
		try {
			const admins = await model.User.findAll({ where: { roleId: 'ROL-ADMIN' } });
    
      res.status(200).json({
        admins
      });
		} catch (err) {
			res.status(500).redirect('back');
		}
  },

  getAdminFullDetails: async (req, res) => {
    const { userId } = req.params;
    const admin = await getAdmin(userId);
    const adminAcitvites = await model.Activitylog.findAll({ where: { userId } });
    
    const data = {
      admin,
      adminAcitvites,
    }
    res.status(200).json({ data });
  },
  
  addAdmin: async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const userExists = await model.User.findOne({ where: { email } });
      
      if (userExists !== null) res.status(404).redirect('back')  
      // const token = jsonWT.signJWT({ email });

      // hash password
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = await bcrypt.hashSync(password, salt);

      const userId = uuid();

      const user = await model.User.create({
        firstName,
        lastName,
        email,
        password,
        userId
      });

      // send login details to admin
      // const link = `${URL}/admin/login`;
      // const options = {
      //   email,
      //   subject: 'New Staff Account Created',
      //   message: `<h5>Login Credentials<h5>
      //             <p>Email: ${email}<p>
      //             <p>Password: ${password}<p>
      //             Click <a href=${link}>here</a> to login`,
      // };

      // await sendEmail(options);
      res.status(200).json({
        message: 'success',
        data: user
      })
    } catch (err) {
      return res.status(500).redirect('back');
    }
  },

	blockAdmin: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await getAdmin(userId);
      if (!user) res.status(404).redirect('back');

      user.block = 1;
      await user.save();
      res.status(200).json({
        message: 'success'
      })
      // res.redirect('/admin/all?msg=Admin blocked Successfully');
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
      res.status(200).json({
        message: 'success'
      })
      // res.redirect('/admin/all?msg=Admin unblocked Successfully');
    } catch (err) {
      res.status(500).redirect('back');
    }
	},

}