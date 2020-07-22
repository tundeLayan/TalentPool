const redis = require('redis');
const bluebird = require('bluebird');

// Promisify all the functions exported by node_redis.
bluebird.promisifyAll(redis);

// Create a client and connect to Redis using configuration from env
const clientConfig = {
  host: process.env.TALENT_POOL_REDIS_HOST,
  port: process.env.TALENT_POOL_REDIS_PORT,
};

if (process.env.TALENT_POOL_REDIS_PASSWORD !== 'null') {
  clientConfig.password = process.env.TALENT_POOL_REDIS_PASSWORD;
}

const client = redis.createClient(clientConfig);

// This is a catch all basic error handler.
client.on('error', (error) => console.log(error));

module.exports = {
  /**
   * Get the application's connected Redis client instance.
   *
   * @returns {Object} - a connected node_redis client instance.
   */
  getClient: () => client,
};
