/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const cloudinary = require('cloudinary').v2;

const models = require('../../Models');

const attributes = [
      'id',
      'firstName',
      'lastName',
      'email',
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
  const {
    passport,
    employeeuserData,
  } = req.session;

  let userId;

  if (passport) {
    const {
      passport: { user },
    } = req.session;
    userId = user.userId;
  } else {
    userId = req.session.userId;
  }

  const {
    isLoggedIn,
    profileImage,
    firstName,
    data,
  } = req.session;

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
  };
};

module.exports = {
  updateProfile: async (req, res) => {
    try {
      const { userId } = employeeData(req, res);

      // Update Profile
      const names = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
      };

      let bodyToUpdate;
      bodyToUpdate = {
        ...req.body,
        ...names,
        userId,
      };

      if (req.files) {
        const imageUrl = await uploadImageFunction(req, res);
        bodyToUpdate = {
          image: imageUrl,
          ...req.body,
          ...names,
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

      // return updated data
      return res.redirect(
        `/employee/dashboard?success_message=Profile updated successfully`,
      );
    } catch (err) {
      req.flash('error', 'Something went wrong. Try again');
    }
  }
}