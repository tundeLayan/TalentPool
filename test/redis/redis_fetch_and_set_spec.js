const assert = require('assert');
const { generateToken } = require('../../Utils/gen-otp');
const redis = require('../../Controllers/dao/impl/redis/redis-client');
const redisKeys = require('../../Controllers/dao/impl/redis/redis-key-gen');

const client = redis.getClient();

// Id used here is a user ID
const keyId = redisKeys.getHashKey('38a1cc44-9f47-495f-a061-634d620a8707');

// set expiry time to 1 second
const EXPIRETIME = 1; // you can set for an hr e.g 60 * 60, for 2 hrs -> 60 * 60 * 2

after(async () => {
  client.quit();
});

describe('Redis Fetch and Set', () => {
  it('should set a token for a user', async () => {
    await client.setAsync(keyId, generateToken(), 'EX', EXPIRETIME);
    const value = await client.getAsync(keyId);
    assert.strictEqual(typeof (value), 'string');
    assert.strictEqual(value.length, 6);
  });
});
describe('Redis fetch an expired key', () => {
  it('should return null object for key expired', (done) => {
    setTimeout(async () => {
      const value = await client.getAsync(keyId);
      assert.strictEqual(typeof (value), 'object');
      done();
    }, 2000);
  }).timeout(3000);
});
