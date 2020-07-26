/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const cloudinary = require('cloudinary').v2;

const { renderPage } = require('../../Utils/render-page');

const { getUserByEmail, getEmployer, getEmployeeByUserId, getSkills, getPortfolio, getEmployeeTeamDetail, getUserById } = require('../dao/db-queries');

const models = require('../../Models');

const userAttributes = ['id', 'firstName', 'lastName', 'email', 'phone', 'roleId'];

const employeeAttributes = [
  'id',
  'userType',
  'verificationStatus',
  'image',
  'gender',
  'hngId',
  'dateOfBirth',
  'availability',
  'userName',
  'location',
  'employeeCv',
  'views',
  'track',
  'userId',
  'referredBy',
  'hasTeam',
];

let image;

const uploadImageFunction = async (req, res) => {
  try {
    await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      (error, result) => {
        if (result) {
          image = result.secure_url;
          // TODO Return Image, save in session and Display in profile creation page
          return image;
        }
        return res.redirect(
          '/employee/update/profile?error_message=Image Upload Failed, Kindly retry',
        );
      },
    );
    return image;
  } catch (err) {
    req.flash('error', err.message);
  }
};

const employeeData = (req, res) => {
  const { passport, employeeuserData } = req.session;

  let userId;

  if (passport) {
    const {
      passport: { user },
    } = req.session;
    userId = user.userId;
    req.session.user = user;
  } else {
    userId = req.session.userId || req.session.employeeId;
  }

  const { isLoggedIn, profileImage, firstName, data } = req.session;

  let userEmail;
  if (data) {
    const { email } = data;
    userEmail = email;
  }

  if (req.params.userId) {
    userId = req.params.userId;
  } else if (isLoggedIn && userId) {
    userId = req.session.userId || req.session.employeeId;
  }

  const { successMessage, errorStatus } = req.query;
  const options = {
    success: successMessage,
    errorMessage: errorStatus,
  };

  return {
    isLoggedIn,
    userId,
    firstName,
    profileImage,
    email: userEmail,
    userData: employeeuserData,
    options,
    data,
  };
};

const teamData = async (team) => {
  const { userId, teamName, status } = team;
  const employerQuery = await getEmployer(models, userId);
  const employerData = await  getUserById(models, userId)

  const { firstName, lastName } = employerData.dataValues
  const employerName = `${ firstName} ${lastName}`;

  const {
    employerPhoneNumber,
    employerEmail,
    employerCountry,
    employerPhoto,
    website,
    facebook,
    twitter,
    instagram,
    linkedin,
  } = await employerQuery;

  const data = {
      name: teamName,
      status,
      employer: {
        name: employerName,
        phone: employerPhoneNumber,
        email: employerEmail,
        country: employerCountry,
        photo: employerPhoto,
        website,
        social: {
          facebook,
          twitter,
          instagram,
          linkedin,
        },
      },
  };

  return data;
};

module.exports = {
  // render employee dashboard
  getEmployeeDashboardPage: async (req, res) => {
    try {
    
      const { email, data, userId } = employeeData(req, res);

      // query the database to find the user
      const employeeQuery = await getEmployeeByUserId(models, data);
      const userQuery = await getUserByEmail(models, email);
      const skillsQuery = await getSkills(models, userId);
      const portfolioQuery = await getPortfolio(models, userId);
      const teamQuery = await getEmployeeTeamDetail(models, userId)

      let profile;
      const team = teamQuery.dataValues;

      if (employeeQuery && userQuery) {
        profile = {
          user: userQuery.dataValues,
          employee: employeeQuery.dataValues,
          skills: skillsQuery.dataValues,
          portfolios: portfolioQuery.dataValues,          
          team: await teamData(team),
        };
      } else {
        profile = {
          user: userQuery.dataValues,
          skills: skillsQuery.dataValues,
          portfolios: portfolioQuery.dataValues,
        };
      }

      console.log(profile);
      return renderPage(
        res,
        'employee/employeeDashboard',
        profile,
        'Employee Dashboard',
        '',
      );
    } catch (err) {
      req.flash('error', 'Something went wrong. Try again');
    }
  },



  // render employee profile page
  getProfilePage: async (req, res) => {
    try {
      const { email, data } = employeeData(req, res);

      // query the database to find the user
      const employeeQuery = await getEmployeeByUserId(models, data);
      // console.log("i got here", employeeQuery);
      const userQuery = await getUserByEmail(models, email);

      // console.log("herr", userQuery);
      let profile;

      if (employeeQuery && userQuery) {
        profile = {
          user: userQuery.dataValues,
          employee: employeeQuery.dataValues,
        };
      } else {
        profile = {
          user: userQuery.dataValues,
        };
      }

      return renderPage(
        res,
        'employee/employeeProfile',
        profile,
        'Employee Profile',
        '',
      );
    } catch (err) {
      req.flash('error', 'Something went wrong. Try again');
    }
  },
  // render employee upate profile page
  getUpdateProfilepage: async (req, res) => {
    try {
      const { email, data, options } = employeeData(req, res);
      // console.log({data});
      // query the database to find the user
      const employeeQuery = await getEmployeeByUserId(models, data);
      // console.log("i got here", employeeQuery);
      const userQuery = await getUserByEmail(models, email);

      let profile;

      if (employeeQuery && userQuery) {
        // console.log("i got here", employeeQuery);
        profile = {
          user: userQuery.dataValues,
          employee: employeeQuery.dataValues,
          success: options.success,
          errorMessage: options.errorMessage,
        };
      } else {
        profile = {
          user: userQuery.dataValues,
          success: options.success,
          errorMessage: options.errorMessage,
        };
      }
      // console.log("here", profile);
      return renderPage(
        res,
        'employee/employeeDashboardSettingsProfileEdit',
        profile,
        'Employee Update Profile',
        '',
      );
      
    } catch (err) {
      req.flash('error', 'Something went wrong. Try again');
    }
  },

  // update employee profile page
  updateProfile: async (req, res) => {
    try {
      const { userId } = employeeData(req, res);
      
      console.log(userId);
      console.log("erere", req.body);

      // Update Profile
      const userBodyToBeUpdated = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        userId,
      };

      const employeeBodyToBeUpdated = {
        availability: req.body.availability,
        userName: req.body.userName,
        location: req.body.location,
        track: req.body.track,
        employeeCv: req.body.employeeCv,
        phoneNumber: req.body.phoneNumber,
        userId,
      };

      let bodyToUpdate;
      bodyToUpdate = employeeBodyToBeUpdated;

      if (req.files) {
        const imageUrl = await uploadImageFunction(req, res);
        bodyToUpdate = {
          image: imageUrl,
          ...employeeBodyToBeUpdated,
        };
        // Set Updated Image to Session
        req.session.profileImage = imageUrl;
      }

      await models.Employee.update(bodyToUpdate, {
        where: {
          userId,
        },
        plain: true,
      });

      await models.User.update(userBodyToBeUpdated, {
        where: {
          userId,
        },
        plain: true,
      });

      // return updated data
      return res.redirect(
        `/employee/dashboard?successMessage=Profile updated successfully`,
      );
    } catch (err) {
      req.flash('error', 'Something went wrong. Try again');
    }
  },
};
