const { uuid } = require('uuidv4');
const model = require('../../Models/index');
const sendEmail = require('../../Utils/send-email');
const jsonWT = require('../../Utils/auth-token');
const { renderPage } = require('../../Utils/render-page');
const { passwordHash } = require('../../Utils/password-hash');
const { getAdmin, activityLog, allAdmin, getUserByEmail, createUser } = require(
  '../dao/db-queries');

const URL = process.env.NODE_ENV === 'development'
  ? process.env.TALENT_POOL_DEV_URL
  : process.env.TALENT_POOL_FRONT_END_URL;

module.exports = {
  getAllAdmin: async (req, res) => {
    try {
      const admins = await allAdmin();
      const data = {
        admins,
        error: req.flash('error'),
        success: req.flash('success'),
      };
      renderPage(res, 'admin/adminList', data, 'Talent Haven | Admin List', 'adminList');
    } catch (err) {
      res.status(500)
      .redirect('back');
    }
  },

  getAdminFullDetails: async (req, res) => {
    const { userId } = req.params;
    const admin = await getAdmin(userId);
    const adminAcitvites = await activityLog();
    const data = {
      admin,
      adminAcitvites,
    };
    renderPage(res, 'Talent Haven | Admin Profile', data, 'adminList');
  },
  blockAdmin: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await getAdmin(userId);
      if (!user) {
        res.status(404)
        .redirect('back');
      }

      user.block = 1;
      await user.save();
      res.redirect('/admin/all?msg=Admin blocked Successfully');
    } catch (err) {
      res.status(500)
      .redirect('back');
    }
  },

  unblockAdmin: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await getAdmin(userId);
      if (!user) {
        res.status(404)
        .redirect('back');
      }

      user.block = 0;
      await user.save();
      res.redirect('back');
    } catch (err) {
      res.status(500)
      .redirect('back');
    }
  },
  addAdmin: async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      const userExists = await getUserByEmail(model, email);
      if (userExists !== null) {
        req.flash('error', 'Email Already Exist');
        res.redirect('back');
      }
      const hashedPassword = await passwordHash(password);
      const userId = uuid();
      const user = {
        firstName,
        lastName,
        email,
        status: '1',
        userId,
        roleId: 'ROL-ADMIN',
        password: hashedPassword,
      };
      await createUser(model, user);
      // send login details to admin
      const link = `${URL}/login`;
      const options = {
        email,
        subject: 'New Talent Haven Staff Account Details',
        message: `<h5>Login Credentials<h5>
                  <p>Email: ${email}<p>
                  <p>Password: ${password}<p>
                  Click <a href=${link}>here</a> to login`,
      };
      try {
        await sendEmail(options);
        req.flash('success', 'Admin Created Successfully');
        res.redirect('back');
      } catch {
        return res.status(500)
        .redirect('back');
      }
    } catch (err) {
      console.log(err);
      return res.status(500)
      .redirect('back');
    }
  },

}
