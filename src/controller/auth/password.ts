import bcrypt from 'bcrypt';

export const hashedPassword = async (password: string): Promise<string> => {
  console.log('PWD', typeof parseInt(process.env.PWD_SALT!));
  const passwordHashed = await bcrypt.hash(password, parseInt(process.env.PWD_SALT!));

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
