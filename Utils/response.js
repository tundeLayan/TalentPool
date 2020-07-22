const errorUserLogin = (req, res, email, password, errorMessage) =>
  res.status(401).render("Pages/employer-signin", {
    path: "/employer/login",
    pageName: "Employer Login",
    errorMessage,
    isLoggedIn: req.session.isLoggedIn,
    success: req.flash("success"),
    oldInput: {
      email,
      password,
    },
    validationErrors: [],
  });

const errorAdminLogin = (req, res, email, password, errorMessage) =>
  res.status(401).render("Pages/admin-login", {
    path: "/admin/login",
    pageName: "Admin Login",
    errorMessage,
    isLoggedIn: req.session.isLoggedIn,
    success: req.flash("success"),
    oldInput: {
      email,
      password,
    },
    validationErrors: [],
  });

module.exports.errorAdminLogin = errorAdminLogin;
module.exports.errorUserLogin = errorUserLogin;
