import bcrypt from 'bcrypt';

export const hashedPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  const passwordHashed = await bcrypt.hash(password, salt);

  return passwordHashed;
};

export const verifyPassword = async (passwordHashed: string, plainPassword: string): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, passwordHashed);
};
