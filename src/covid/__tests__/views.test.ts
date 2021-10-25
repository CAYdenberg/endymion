import { Request } from 'express';

import { startDb } from '../../db/index';
import { getOk } from '../views';

const req = {
  body: {},
} as Request;

const db = {
  authenticate: jest.fn(() => Promise.resolve(true)),
} as any;

describe('test the tests', () => {
  beforeAll(() => {
    startDb(db);
  });

  it('runs tests successfully', () => {
    return expect(getOk(req.body)).resolves.toHaveProperty('ok', true);
  });
});
