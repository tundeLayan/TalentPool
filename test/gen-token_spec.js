const assert = require('assert');
const { generateToken } = require('../Utils/gen-otp');

describe('Generate token', () => {
  it('should generate a token length of 6', () => {
    assert.strictEqual(generateToken().length, 6);
  });
  it('should generate a token length of variable length', () => {
    assert.strictEqual(generateToken(10).length, 10);
  });
  it('should generate a string', () => {
    assert.strictEqual(typeof generateToken(), 'string');
  });
  it('should check if all token generate are numbers when converted', () => {
    let token = generateToken();
    token = parseInt(token, 10);
    assert.strictEqual(typeof token, 'number');
  });
});
