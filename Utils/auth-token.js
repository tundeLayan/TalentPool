const jwt = require('jsonwebtoken');

exports.signJWT = (data, time = '1d') => {
  const secret = process.env.TALENT_POOL_JWT_SECRET;
  return jwt.sign(data, secret, { expiresIn: time });
};

exports.verifyJWT = (token) => {
  const key = process.env.TALENT_POOL_JWT_SECRET;
  const decode = jwt.verify(token, key, (err, decoded) => {
    if (err) {
      return err;
    }
    return decoded;
  });
  return decode;
};
