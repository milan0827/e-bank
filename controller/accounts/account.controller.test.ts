import request from 'supertest';
import app from '../../app';
import accountsController from './accounts.controller';
import { NextFunction, Request, Response } from 'express';
import { db } from '../../db/drizzle';

// test('Returns the list of account', async () => {
//   const res = await request(app).get('/api/v1/accounts');
//   console.log('res', res.body);
//   expect(res.status).toBe(200);
// expect(res.body).not.toBeNull();
// expect(res.body.data.length).toBeGreaterThan(0);
// expect(res.body.status).toEqual('success');
// });

describe('POST /api/v1/accounts ', () => {
  it('Shoud return the list of account', async () => {
    const res = await request(app).get('/api/v1/accounts');
    console.log(res.body, 'Res');

    expect(res.statusCode).toBe(200);
    expect(res.body).not.toBeNull();
    expect(res.body.status).toEqual('success');
  }),
    it('Should create account successfully', async () => {
      const mockResult = { currency: 'NRS', balance: 100, owner: 'Test user' };
      // Mocking db insert behavior
      db.insert = jest.fn().mockImplementation(() => ({
        values: () => ({
          returning: async () => mockResult,
        }),
      }));

      // Mock req and res
      const req = {
        body: {
          owner: 'Test user',
          balance: 100,
          currency: 'NRS',
        },
      } as Request;

      const status = jest.fn().mockReturnThis();
      const json = jest.fn();
      const res = {
        status,
        json,
      } as unknown as Response;

      const nextFn = jest.fn() as NextFunction;

      await accountsController.createAccount(req, res, nextFn);

      expect(status).toHaveBeenCalledWith(200);
    });
});
