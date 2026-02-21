const test = require('node:test');
const assert = require('node:assert/strict');

const bundle = require('../dist/vue-scrollama.umd.js');

test('UMD bundle exposes the Scrollama component contract', () => {
  assert.ok(bundle.default);
  assert.equal(bundle.default.name, 'Scrollama');
  assert.equal(typeof bundle.default.mounted, 'function');
  assert.equal(typeof bundle.default.beforeDestroy, 'function');
});
