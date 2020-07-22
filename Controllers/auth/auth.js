const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const model = require("../Models/index");
const jsonWT = require("../Utils/auth-token");
const asyncHandler = require("../Middleware/async");
const sendEmail = require("../../Utils/sendEmail");
const {
  validateUserRequest,
  validateAdminRequest,
} = require("../../Utils/validators/request-body-validator");
const {
  errorAdminLogin,
  errorUserLogin,
  successResMsg,
  errorResMsg,
  sessionSuccessResMsg,
} = require("../../Utils/response");

const URL =
  process.env.NODE_ENV === "development"
    ? process.env.TALENT_POOL_DEV_URL
    : process.env.TALENT_POOL_FRONT_END_URL;

exports.userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  let currentUser;

  validateUserRequest(req, res, email, password);

  model.User.findOne({ where: { email } })
    .then(async (user) => {
      if (!user) {
        return errorUserLogin(
          req,
          res,
          email,
          password,
          "Invalid email or password."
        );
      }

      // Getting the user type ID
      let userTypeId = null;
      let verificationStatus = null;
      let isEmployer = false;

      if (user.role_id === "ROL-EMPLOYEE") {
        const employee = await model.Employee.findOne({
          where: { user_id: user.user_id },
        });
        if (employee) {
          userTypeId = employee.user_id;
        }
      } else if (user.role_id === "ROL-EMPLOYER") {
        isEmployer = true;
        const employer = await model.Employer.findOne({
          where: { user_id: user.user_id },
        });
        if (employer) {
          userTypeId = employer.employee_id;
          verificationStatus = employer.verificationStatus;
        }
      }

      if (user.status === "0") {
        return errorUserLogin(
          req,
          res,
          email,
          password,
          "User is not verified"
        );
      }

      if (user.block) {
        return errorUserLogin(req, res, email, password, "User Blocked!");
      }

      currentUser = user;
      bcrypt
        .compare(password, user.password)
        .then((valid) => {
          if (valid) {
            let data = {
              email: currentUser.email,
              userId: currentUser.user_id.toString(),
              userRole: currentUser.role_id,
              userTypeId,
            };

            if (isEmployer) data = { ...data, verificationStatus };

            req.session.data = data;
            req.session.createdAt = Date.now();
            req.session.isLoggedIn = true;
            req.session.employerId = data.userTypeId;

            if (user.role_id === "ROL-EMPLOYER")
              return res.redirect("/employer/dashboard");

            return res.redirect(
              `/employee/dashboard/${data.userTypeId}?success_message=Login Successful`
            );
          }
          return errorUserLogin(
            req,
            res,
            email,
            password,
            "Invalid email or password."
          );
        })
        .catch(() => {
          res.redirect("/employer/login");
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
};

exports.adminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  validateAdminRequest(req, res, email, password);
  model.User.findOne({
    where: {
      email,
    },
  })
    .then(async (user) => {
      if (!user) {
        return errorAdminLogin(
          req,
          res,
          email,
          password,
          "Incorrect login details,user does not exist."
        );
      }
      if (user.role_id !== "ROL-ADMIN" && user.role_id !== "ROL-SUPERADMIN") {
        return errorAdminLogin(
          req,
          res,
          email,
          password,
          "User is not an admin."
        );
      }
      let userTypeId = null;
      const admin = await model.Admin.findOne({
        where: {
          user_id: user.user_id,
        },
      });

      if (admin) {
        userTypeId = admin.userId;
        req.session.name = `${admin.firstName} ${admin.lastName}`;
      }

      if (user.status === "0") {
        return errorAdminLogin(
          req,
          res,
          email,
          password,
          "User is not verified."
        );
      }
      if (user.block) {
        return errorAdminLogin(req, res, email, password, "User is blocked.");
      }
      bcrypt
        .compare(password, user.password)
        .then((valid) => {
          if (valid) {
            const data = {
              email: user.email,
              userRole: user.role_id,
              userTypeId,
            };
            req.session.data = data;
            req.session.isLoggedIn = true;
            req.session.userId = user.user_id;
            req.session.createdAt = Date.now();
            req.session.adminId = userTypeId;
            res.redirect("/admin/dashboard?message=Welcome, login successful!");
          }
          return errorAdminLogin(
            req,
            res,
            email,
            password,
            "Incorrect login details"
          );
        })
        .catch(() => {
          res.redirect("/admin/login");
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res) => {
  req.session = null;
  res.redirect("/");
};

const getResetPasswordToken = () => {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken, "utf8")
    .digest("hex");

  // Set expire
  const resetPasswordExpire = Date.now() + 3600000;

  return {
    resetToken,
    resetPasswordToken,
    resetPasswordExpire,
  };
};

// @desc      Forgot password
// @route     POST /v1/auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await model.User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (!user) {
    req.flash("error", "User with this email is not found");
    return res.redirect("/recover/password");
  }

  // Get reset token
  const {
    resetToken,
    resetPasswordToken,
    resetPasswordExpire,
  } = getResetPasswordToken();

  await model.User.update(
    {
      resetPasswordToken,
      resetPasswordExpire,
    },
    {
      where: {
        email: req.body.email,
      },
    }
  );

  // Create reset url
  const resetUrl = `${URL}/password/reset/${resetToken}`;
  const message = `You are receiving this email because a password reset has been requested
  with your email. Please click this link to proceed: \n\n <a href=${resetUrl}>link</a> or
  ignore if you are unaware of this action.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });

    req.flash("success", "Reset password link has been sent to your mail");
    return res.redirect("/recover/password");
  } catch (err) {
    // eslint-disable-next-line no-console
    user.reset_password_token = null;
    user.reset_password_expire = null;

    await user.save({
      validateBeforeSave: false,
    });

    req.flash("error", "An error occured, please try again!");
    return res.redirect("/recover/password");
  }
});

// @desc      Reset password
// @route     PUT /v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.body.token, "utf8")
    .digest("hex");

  const user = await model.User.findOne({
    where: {
      reset_password_token: resetPasswordToken,
    },
  });

  if (!user) {
    req.flash("error", "Invalid token");
    return res.redirect("/recover/password");
  }

  if (user.dataValues.resetPasswordExpire < Date.now()) {
    req.flash("error", "Reset password token expired,please try again");
    return res.redirect("/recover/password");
  }

  // hash password before saving
  const salt = bcrypt.genSaltSync(10);

  // Set new password
  user.password = bcrypt.hashSync(req.body.password, salt);
  user.reset_password_token = null;
  user.reset_password_expire = null;
  await user.save();

  req.flash("success", "Password changed successfully");

  if (user.role_id === "ROL-EMPLOYER") return res.redirect("/employer/login");
  if (user.role_id === "ROL-EMPLOYEE") return res.redirect("/employee/login");
});

exports.resendVerificationLink = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errResponse = errors.array({
      onlyFirstError: true,
    });
    req.flash("error", errResponse[0].msg);
    return res.redirect("/verify-email");
  }
  // check if user exist
  const checkUser = await model.User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!checkUser) {
    // return errorResMsg(res, 403, 'Invalid email');
    req.flash("error", "Invalid email");
    return res.redirect("/verify-email");
  }

  if (checkUser.status === "1") {
    // return errorResMsg(res, 401, 'This email has been verified');
    req.flash("error", "This email has been verified");
    return res.redirect("/verify-email");
  }

  const basicInfo = {
    email: checkUser.email,
  };

  // generate new verification_token
  const token = jsonWT.signJWT(basicInfo);
  checkUser.verification_token = token;
  checkUser.save();

  // mail verification code to the user
  const verificationUrl = `${URL}/auth/email/verify?verification_code=${token}`;

  const message = `<p> Hello, you requested for the resend of your verification link.
        Kindly verify your email </p><a href ='${verificationUrl}'>link</a>`;
  try {
    await sendEmail({
      email: checkUser.email,
      subject: "Email verification",
      message,
    });
    // const data = { message: 'Verification email re-sent!' };
    // successResMsg(res, 201, data);
    req.flash(
      "success",
      "Please check your email. Verification link has been sent."
    );
    return res.redirect("/verify-email");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.render("Pages/verify-email", {
      PageName: "Verify Email",
    });
  }
};


