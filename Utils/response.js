module.exports = {
  errorUserLogin: (req, res, email, password, errorMessage) => {
    const { isLoggedIn } = req.session;
    return res.status(401).render('auth/login', {
      path: '/login',
      pageName: 'Login',
      errorMessage,
      isLoggedIn,
      success: req.flash('success'),
      oldInput: {
        email,
        password,
      },
      validationErrors: [],
    });
  },
};
