const passport = require('passport');
const { uuid } = require('uuidv4');
const model = require('../Models');
const { passwordHash } = require('./password-hash')

const getUserData = async (req, profile, user, done) => {
  const { 
    roleId,
    userId,
    status, 
    block, 
    firstName, 
    lastName, 
    email,
  } = user;
  try {
    let userTypeId = null;
    let verificationStatus = null;
    if (roleId === 'ROL-EMPLOYEE') {
      const employee = await model.Employee.findOne({ where: { userId } });
      if (employee) {
        userTypeId = employee.userId;
        verificationStatus = employee.verificationStatus;
      }
    } else if (roleId === 'ROL-EMPLOYER') {
      const employer = await model.Employer.findOne({ where: { userId } });
      if (employer) {
        userTypeId = employer.userId;
        verificationStatus = employer.verificationStatus;
      }
    }

    if (status === '0') {
      return done(null, false, req.flash('error', 'User is not verified'));
    }

    if (block) {
      return done(null, false, req.flash('error', 'User is blocked, please contact an Admin'));
    }
    const data = {
      firstName,
      lastName,
      email,
      userId,
      userRole: roleId,
      userTypeId,
      verificationStatus,
    };

    return data;
  } catch (error) {
    return done(null, false, req.flash('error', 'Authentication error'));
  }
};

const createUser = async (req, profile, userRole, done) => {
  try {
    const password = '@Qwerty123!';
    const hashedPassword = passwordHash(password);

    const userSave = {
      firstName: profile.displayName.split(' ')[0],
      lastName: profile.displayName.split(' ')[1],
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
      userId: userSave.userId,
      userRole: userSave.roleId,
      userTypeId: null,
    };

    await model.User.create(userSave);
    return data;
  } catch (error) {
    return done(null, false, req.flash('error', 'Internal server error occured'));
  }
};

const renderPage = async (req, res) => {
  const {user} =  req ;
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
  // req.flash('success', 'Authentication successful!');
  if (user.userRole === 'ROL-EMPLOYER') {
    req.session.employerId = user.userId;
    return res.redirect('/employer/dashboard');
  }
  req.session.employeeId = user.userId;
  return res.redirect(
    `/employee/dashboard`,
  );
};

const checkUser = async (clause) => {
  const user = await model.User.findOne({
    where: {
      email: clause,
    },
  });
  return user;
}

const getUserProfile = (userType) => {
 return passport.authenticate(userType, { scope: ['profile', 'email'] });
}

const authCallbackHandler = (userType) => {
 return passport.authenticate(userType, {
    failureRedirect: '/login',
    failureFlash: true,
  })
}

const handAuthCallback =   async (req, res) => {
  try {
    renderPage(req, res);
  } catch (error) {
    res.redirect('/login');
  }
}

module.exports = {
  getUserData,
  createUser,
  renderPage,
  checkUser,
  getUserProfile,
  authCallbackHandler,
  handAuthCallback,
}