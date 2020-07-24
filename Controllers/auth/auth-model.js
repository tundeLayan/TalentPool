const model = require('../../Models/index');

exports.findUser = async (email) => {
  return model.User.findOne({
    where: { email },
  });
}

exports.createUser = async (data) => {
  return model.User.create(data);
}