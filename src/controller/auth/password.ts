import bcrypt from 'bcrypt';
import Logger from '../../lib/logger';

export const hashedPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  const passwordHashed = await bcrypt.hash(password, salt);

  return passwordHashed;
};

export const verifyPassword = (passwordHashed: string, plainPassword: string) => {
  bcrypt.compare(plainPassword, passwordHashed, (err, isMatch) => {
    if (err) {
      Logger.error(err);
      return err;
    } else Logger.info('ismatch.......', isMatch);
  });
};
