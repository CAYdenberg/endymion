import request from 'supertest';

import appCreator from '../src/index';

const app = appCreator({
  port: 3030,
  nodeEnv: 'test',
  dbCxn: 'sqlite::memory:',
  reqPerTenMin: 200,
  publicAccessKey: '',
  internalAccessKey: '',
});

describe('/', () => {
  it('responds with 200', () => {
    return request(app).get('/').expect(200);
  });
});
