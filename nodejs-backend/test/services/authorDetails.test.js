const assert = require('assert');
const app = require('../../src/app');

describe('\'authorDetails\' service', () => {
  it('registered the service', () => {
    const service = app.service('authorDetails');

    assert.ok(service, 'Registered the service (authorDetails)');
  });
});
