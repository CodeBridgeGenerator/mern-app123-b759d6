const assert = require('assert');
const app = require('../../src/app');

describe('\'reviewDetails\' service', () => {
  it('registered the service', () => {
    const service = app.service('reviewDetails');

    assert.ok(service, 'Registered the service (reviewDetails)');
  });
});
