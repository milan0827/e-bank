import { z } from 'zod';

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type LoginType = z.infer<typeof LoginSchema>;

export const RegisterUserSchema = z.object({
  username: z.string(),
  email: z.string(),
  fullName: z.string(),
  password: z.string().min(6),
});

export type RegisterUserType = z.infer<typeof RegisterUserSchema>;
