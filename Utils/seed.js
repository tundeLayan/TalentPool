const bcrypt = require('bcryptjs');
const debug = require('debug')('talentpool:server');
const inquirer = require('inquirer');
const { uuid } = require('uuidv4');
const chalk = require('chalk');

const model = require('../Models/index');
const redis = require('../Controllers/dao/impl/redis/redis-client');

const client = redis.getClient();

const confirmPasswordInput = async (input) => {
  if (input.length < 8) {
    return 'Password must be at least 8 characters long';
  }

  return true;
};

const generateData = () => {
  const result = [];
  const categories = ['Graphics & Design', 'Programming & Technology',
    'Marketing', 'Health',
    'Agriculture', 'Finance',
    'Video & Animation',
  ];
  for (let i = 0; i < categories.length; i += 1) {
    const id = uuid();
    result.push({ categoryId: id, categoryName: categories[i] });
  }

  return result;
};

const seedSuperAdmin = async () => {

  // eslint-disable-next-line consistent-return
  client.flushall((err, reply) => {
    if (err) {
      debug(chalk.redBright(`[x] Error Flushing Cache: ${err}`));
      return process.exit(1);
    }
    debug(chalk.green(`[✔] Cache Flush: ${reply}`));
  });

  let logInit = chalk.yellowBright('[!] Initializing Super Admin!');
  debug(logInit);
  const rolesExists = await model.User.findOne({ where: { roleId: 'ROL-SUPERADMIN' } });
  if (rolesExists) {
    logInit = chalk.green('[✔] Super admin already initialized');
    debug(logInit);
  } else {
    await model.sequelize.drop();
    await model.sequelize.sync();
    const rolesCreated = await model.Role.bulkCreate([
      { roleName: 'superAdmin', roleId: 'ROL-SUPERADMIN' },
      { roleName: 'admin', roleId: 'ROL-ADMIN' },
      { roleName: 'employer', roleId: 'ROL-EMPLOYER' },
      { roleName: 'employee', roleId: 'ROL-EMPLOYEE' },
    ]);
    await model.CompanyCategory.bulkCreate(generateData());
    if (rolesCreated) {
      inquirer
        .prompt([
          {
            name: 'firstName',
            message: 'First Name (default: admin)',
            default: 'admin',
          },
          {
            name: 'lastName',
            message: 'Last Name (default: admin)',
            default: 'admin',
          },
          {
            type: 'password',
            name: 'password',
            message: 'password:',
            mask: '*',
            validate: confirmPasswordInput,
          },
          {
            name: 'email',
            message: 'email (default: email@example.com)',
            default: 'email@example.com',
          },
        ])
        .then(async (answers) => {
          // hash password
          const salt = bcrypt.genSaltSync(10);
          const userId = uuid();

          // eslint-disable-next-line no-param-reassign
          answers.password = await bcrypt.hashSync(answers.password, salt);
          const superAdminAccount = {
            firstName: answers.firstName,
            lastName: answers.lastName,
            email: answers.email,
            password: answers.password,
            userId,
            roleId: 'ROL-SUPERADMIN',
            status: '1',
          };

          await model.User.create(superAdminAccount);
          const log = chalk.green('[✔] Super admin created successfully');
          debug(log);
        });
    }
  }
};

module.exports.seedSuperAdmin = seedSuperAdmin;
