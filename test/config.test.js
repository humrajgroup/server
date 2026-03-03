const test = require('node:test');
const assert = require('node:assert/strict');
const config = require('../src/config');

test('config has required keys', () => {
  assert.equal(typeof config.port, 'number');
  assert.equal(typeof config.features.chat, 'boolean');
  assert.equal(typeof config.jwtSecret, 'string');
});
