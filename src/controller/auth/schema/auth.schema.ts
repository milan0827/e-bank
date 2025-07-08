import { z } from 'zod';

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const RegisterUserSchema = z.object({
  username: z.string(),
  email: z.string(),
  fullName: z.string(),
  password: z.string().min(6),
});

export const changePasswordSchema = z.object({
  currPassword: z.string(),
  newPassword: z.string(),
});

export type changePasswordType = z.infer<typeof changePasswordSchema>;
export type LoginType = z.infer<typeof LoginSchema>;
export type RegisterUserType = z.infer<typeof RegisterUserSchema>;
