'use strict';

const mock = require('egg-mock');

describe('test/graphql-xsy.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/graphql-xsy-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, graphqlXsy')
      .expect(200);
  });
});
