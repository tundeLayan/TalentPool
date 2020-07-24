module.exports = {
  authErrorRedirect: (
    req,
    res,
    email,
    password,
    errorMessage,
    page,
    title,
    pagePath,
  ) => {
    const { isLoggedIn } = req.session;
    return res.status(401).render(`${page}`, {
      path: `${pagePath}`,
      pageName: `${title}`,
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
