require('dotenv').config();
const assert = require('assert');

const keyGenerator = require('../../Controllers/dao/impl/redis/redis-key-gen');

const expectedKeyPrefix = 'test';

keyGenerator.setPrefix(expectedKeyPrefix);

describe('Redis key', () => {
  it('should get the hash key', () => {
    assert.strictEqual(
      keyGenerator.getHashKey('8b77b13d-a78e-4e78-a9de-356a0ce7d97b'),
      `${expectedKeyPrefix}:talentpool:info:8b77b13d-a78e-4e78-a9de-356a0ce7d97b`,
    );
  });

  it('should get all hash keys stored', () => {
    assert.strictEqual(
      keyGenerator.getIDsKey(),
      `${expectedKeyPrefix}:talentpool:ids`,
    );
  });
});
