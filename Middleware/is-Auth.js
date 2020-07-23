/* eslint-disable consistent-return */
const auth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
      req.flash('You need to re-login to continue');
      return res.redirect('/');
    }
    next();
  };
  
  const active = async (req, res, next) => {
    if (req.session.isLoggedIn) {
      const now = Date.now();
      const { createdAt } = req.session;
  
      if (now > createdAt + process.env.SESSION_ABSOLUTE_TIMEOUT) {
        req.session = null;
        req.flash('error', 'Session expired. Login to continue');
        return res.redirect('/');
      }
    }
  
    next();
  };
  module.exports.active = active;
  module.exports.auth = auth;