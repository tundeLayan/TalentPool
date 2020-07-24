const errorResMsg = (res, code, message) =>
  res.status(code).json({
    status: 'error',
    error: message,
  });

const successResMsg = (res, code, data) =>
  res.status(code).json({
    status: 'success',
    data,
  });

const sessionSuccessResMsg = (res, message, code, token, user) =>
  res.status(code).json({
    status: 'success',
    message,
    data: {
      authenticated: true,
      token,
      user,
    },
  });

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
module.exports.errorResMsg = errorResMsg;
module.exports.successResMsg = successResMsg;
module.exports.sessionSuccessResMsg = sessionSuccessResMsg;
