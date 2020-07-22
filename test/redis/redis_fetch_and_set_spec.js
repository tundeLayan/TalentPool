const assert = require('assert');
const { generateToken } = require('../../Utils/gen-otp');
const redis = require('../../Controllers/dao/impl/redis/redis-client');
const redisKeys = require('../../Controllers/dao/impl/redis/redis-key-gen');

const client = redis.getClient();

// Id used here is a user ID
const keyId = redisKeys.getHashKey('38a1cc44-9f47-495f-a061-634d620a8707');

after(async () => {
  client.quit();
});

describe('Redis Fetch and Set', () => {
  it('should set a token for a user for a given time', async () => {
    await client.setAsync(keyId, generateToken());
    await client.expire(keyId, 6);
    const value = await client.getAsync(keyId);
    assert.strictEqual(typeof (value), 'string');
    assert.strictEqual(value.length, 6);
  });
});
