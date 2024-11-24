import request from 'supertest';
import app from '../app';

test('Returns the list of account', async () => {
  const res = await request(app).get('/api/v1/accounts');
  console.log('res', res.body);
  expect(res.status).toBe(200);
  expect(res.body).not.toBeNull();
  expect(res.body.data.length).toBeGreaterThan(0);
  expect(res.body.status).toEqual('success');
});

// describe('Creating account', () => {
//   const mockAccount = {
//     owner: 'Test Account',
//     balance: 10000,
//     currency: 'NRS',
//   };
//   const req = {
//     body: { owner: 'Test Account', currency: 'NRS', balance: 10000 },
//   } as unknown as Request;

//   const res = {
//     status: jest.fn().mockReturnThis(),
//     json: jest.fn(),
//   } as unknown as Response;

//   const next = jest.fn();

//   it('Should create an account and send back response', async () => {
//     const mockSaveAccount = jest.fn().mockResolvedValue(mockAccount);

//     await accountsController.createAccount(req, res, next);
//     expect(mockSaveAccount).toHaveBeenCalledWith(expect.objectContaining({ balance: 10000, currency: 'NRS', owner: 'Test Account' }));
//     expect(res.status).toHaveBeenCalled();
//     expect(res.json).toHaveBeenCalledWith(mockAccount);
//     expect(next).toHaveBeenCalled();
//   });

//   it('Should call next with an error if account creation fails', async () => {
//     const error = new Error('Database error');
//     const mockSaveAccount = jest.fn().mockRejectedValue(error);
//     await accountsController.createAccount(req, res, next);

//     expect(mockSaveAccount).toHaveBeenCalledWith(expect.objectContaining({ balance: 10000, currency: 'NRS', owner: 'Test Account' }));
//     expect(res.status).not.toHaveBeenCalled();
//     expect(res.json).not.toHaveBeenCalled();
//     expect(next).toHaveBeenCalledWith(error);
//   });
// });
