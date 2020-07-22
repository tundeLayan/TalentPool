require('dotenv').config();
const assert = require('assert');
const redis = require('../../Controllers/dao/impl/redis/redis-client');

const client = redis.getClient();

const testSuiteName = 'dataTypes';
const testKeyName = `${testSuiteName}:test`;

beforeEach(async () => {
  await client.delAsync(testKeyName);
});

afterEach(async () => {
  await client.delAsync(testKeyName);
});

after(async () => {
  // Release Redis connection.
  client.quit();
});

describe('Redis Data types', () => {
  describe('Int', () => {
    it('actions on int data types', async () => {
      await client.setAsync(testKeyName, 22);
      let value = await client.getAsync(testKeyName);
      assert.strictEqual(typeof (value), 'string');
      assert.strictEqual(value, '22');

      value = await client.incrbyAsync(testKeyName, 1);
      assert.strictEqual(typeof (value), 'number');
      assert.strictEqual(value, 23);
      assert.strictEqual(parseInt(value, 10), 23);
    });
  });
  describe('Strings', () => {
    it('should check type of string and return a string', async () => {
      await client.setAsync(testKeyName, 'hello');
      const value = await client.getAsync(testKeyName);
      assert.strictEqual(typeof (value), 'string');
      assert.strictEqual(value, 'hello');
    });
  });
  describe('Float', () => {
    it('actions on float datatype', async () => {
      await client.setAsync(testKeyName, 22.5);
      const value = await client.incrbyfloatAsync(testKeyName, 1);
      assert.strictEqual(typeof (value), 'string');
      assert.strictEqual(value, '23.5');
    });
  });
  describe('Lists', () => {
    it('should check type of object and return a List', async () => {
      await client.rpushAsync(testKeyName, 'one', 'two', 'three');
      const value = await client.lrangeAsync(testKeyName, 0, 3);
      assert.strictEqual(typeof (value), 'object');
      assert(Array.isArray(value));
      assert.deepStrictEqual(value, ['one', 'two', 'three']);
    });
  });
  describe('Sets', () => {
    it('should check type of object and return a length of a set', async () => {
      await client.saddAsync(testKeyName, 'one', 'two', 'two', 'three');
      const value = await client.smembersAsync(testKeyName);
      assert.strictEqual(typeof (value), 'object');
      assert.strictEqual(value.length, 3);
    });
  });
  describe('Hash', () => {
    it('should check type of string and return a string', async () => {
      await client.hmsetAsync(testKeyName, {
        name: 'John Doe',
        age: 42,
      });
      const value = await client.hgetallAsync(testKeyName);
      assert.strictEqual(typeof (value), 'object');
      assert.strictEqual(Array.isArray(value), false);
      assert.strictEqual(typeof (value.age), 'string');
      assert.strictEqual(parseInt(value.age, 10), 42);
      assert.deepStrictEqual(value, {
        name: 'John Doe',
        age: '42',
      });
    });
  });
});
