import { z } from 'zod';

export const CreateTransferSchema = z.object({
  fromAccountId: z.number().positive(),
  toAccountId: z.number().positive(),
  amount: z.number().positive(),
  currency: z.string(),
});
