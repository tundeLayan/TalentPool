const jwt = require('jsonwebtoken');

exports.signJWT = (data, time = '1d') => {
  const secret = 'somethinglight';
  return jwt.sign(data, secret, { expiresIn: time });
};

exports.verifyJWT = (token) => {
  const key = 'somethinglight';
  const decode = jwt.verify(token, key, (err, decoded) => {
    if (err) {
      return err;
    }
    return decoded;
  });
  return decode;
};
