/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const cloudinary = require('cloudinary').v2;

const { renderPage } = require('../../Utils/render-page');

const { getUserByEmail, getEmployee } = require('../dao/db-queries');

const models = require('../../Models');

const userAttributes = ['id', 'firstName', 'lastName', 'email', 'roleId'];

const employeeAttributes = [
  'id',
  'userType',
  'verificationStatus',
  'phoneNumber',
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
    userId = req.session.userId;
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
    userId = req.session.userId;
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

module.exports = {
  // render employee profile page
  getProfilePage: async (req, res) => {
    try {
      const { email, data } = employeeData(req, res);

      // query the database to find the user
      const employeeQuery = await getEmployee(models, data);
      const userQuery = await getUserByEmail(models, email);

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

      // query the database to find the user
      const employeeQuery = await getEmployee(models, data);
      const userQuery = await getUserByEmail(models, email);

      let profile;

      if (employeeQuery && userQuery) {
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
