require('dotenv').config(); // this is important!
module.exports = {
  development: {
    username: process.env.TALENT_POOL_DB_USER,
    password: process.env.TALENT_POOL_DB_PASSWORD,
    database: process.env.TALENT_POOL_DB_NAME,
    host: process.env.TALENT_POOL_DB_HOST,
    dialect: process.env.TALENT_POOL_DB_DIALECT,
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};
