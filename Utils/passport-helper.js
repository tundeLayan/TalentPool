const { uuid } = require('uuidv4');
const bcrypt = require('bcryptjs');
const model = require('../Models');

exports.getUserData = async (req, profile, user, done) => {
  try {
    let userTypeId = null;
    let verificationStatus = null;
    if (user.roleId === 'ROL-EMPLOYEE') {
      const employee = await model.Employee.findOne({ where: { userId: user.userId } });
      if (employee) {
        userTypeId = employee.userId;
        verificationStatus = employee.verificationStatus;
      }
    } else if (user.roleId === 'ROL-EMPLOYER') {
      const employer = await model.Employer.findOne({ where: { userId: user.userId } });
      if (employer) {
        userTypeId = employer.userId;
        verificationStatus = employer.verificationStatus;
      }
    }

    if (user.status === '0') {
      return done(null, false, req.flash('error', 'User is not verified'));
    }

    if (user.block) {
      return done(null, false, req.flash('error', 'User is blocked, please contact an Admin'));
    }
    const data = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userId: user.userId.toString(),
      userRole: user.roleId,
      userTypeId,
      verificationStatus,
    };

    return data;
  } catch (error) {
    return done(null, false, req.flash('error', 'Authentication error'));
  }
};

exports.createUser = async (req, profile, userRole, done) => {
  try {
    const password = process.env.TALENT_POOL_JWT_SECRET;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userSave = {
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: profile.emails[0].value,
      password: hashedPassword,
      roleId: userRole,
      userId: uuid(),
      status: '1',
      provider: profile.provider,
    };

    const data = {
      firstName: userSave.firstName,
      lastName: userSave.lastName,
      email: userSave.email,
      userId: userSave.userId.toString(),
      userRole: userSave.roleId,
      userTypeId: null,
    };

    await model.User.create(userSave);
    return data;
  } catch (error) {
    return done(null, false, req.flash('error', 'Internal server error occured'));
  }
};

exports.renderPage = async (req, res, user) => {
  const data = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    userRole: user.userRole,
    userTypeId: user.userTypeId,
    verificationStatus: user.verificationStatus,
  };

  req.session.data = data;
  req.session.isLoggedIn = true;
  req.session.userId = user.userId;
  req.flash('success', 'Authentication successful!');
  if (user.userRole === 'ROL-EMPLOYER') {
    return res.redirect('/employer/dashboard');
  }
  return res.redirect(
    `/employee/dashboard/${user.userTypeId}?success_message=Login Successful`,
  );
};
