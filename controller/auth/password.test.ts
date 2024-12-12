import { hashedPassword, verifyPassword } from './password';

describe('Password testing', () => {
  it('Hashing password', async () => {
    const password = 'Hello world';
    const hashPwd = await hashedPassword(password);
    const passwordOk = await verifyPassword(hashPwd, password);

    expect(passwordOk).toBe(true);
  });

  it('Wrong password', async () => {
    const password = 'Hello world';
    const hashPwd = await hashedPassword(password);
    const wrongPassword = 'hello';
    const passwordOk = await verifyPassword(hashPwd, wrongPassword);
    expect(passwordOk).toBe(false);
  });
});
