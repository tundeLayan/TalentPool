const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const secret = 'somethinglight';

exports.signJWT = (data, time = '1d') => {
  return jwt.sign(data, secret, { expiresIn: time });
};

exports.verifyJWT = (token) => {
  return jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return err;
    }
    return decoded;
  });
};

exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hashSync(password, salt);
}
