const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword
}
