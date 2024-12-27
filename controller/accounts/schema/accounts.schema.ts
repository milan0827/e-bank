import { z } from 'zod';

export const CreateAccountSchema = z.object({
  owner: z.string(),
  balance: z.number().positive(),
  currency: z.string(),
});

export type CreateAccountType = z.infer<typeof CreateAccountSchema>;
