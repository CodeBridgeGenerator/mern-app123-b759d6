const assert = require('assert');
const app = require('../../src/app');

describe('\'bookDetails\' service', () => {
  it('registered the service', () => {
    const service = app.service('bookDetails');

    assert.ok(service, 'Registered the service (bookDetails)');
  });
});
