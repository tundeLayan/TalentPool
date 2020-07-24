const bcrypt = require('bcryptjs');
 
 exports.passwordHash = (password) => {
      const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
   
 }