const model = require('../Models/index');

exports.userCheck = (email) => {
     return model.User.findOne({ where: { email } });
}

exports.userCreate = (userSave) => {
  return model.User.create(userSave);
  
}

exports.userUpdate =  (userEmail) => {
    return model.User.update(
        { status: '1' },
        { where: { email:userEmail,}},
         
      );
}