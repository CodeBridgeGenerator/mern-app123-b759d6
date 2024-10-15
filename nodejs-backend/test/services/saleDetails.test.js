const assert = require('assert');
const app = require('../../src/app');

describe('\'saleDetails\' service', () => {
  it('registered the service', () => {
    const service = app.service('saleDetails');

    assert.ok(service, 'Registered the service (saleDetails)');
  });
});
