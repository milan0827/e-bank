import bcrypt from 'bcrypt';

export const hashedPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  const passwordHashed = await bcrypt.hash(password, salt);

  return passwordHashed;
};

export const verifyPassword = (passwordHashed: string, plainPassword: string) => {
  bcrypt.compare(plainPassword, passwordHashed, (err, isMatch) => {
    if (err) {
      console.error(err);
      return err;
    } else console.info('ismatch.......', isMatch);
  });
};
