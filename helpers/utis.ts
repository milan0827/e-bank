import { CreateTransferParams } from '../types/transfers';

export const validAccountCurrency = (InputCurrency: CreateTransferParams['currency'], validCurrency: CreateTransferParams['currency']): boolean => {
  return InputCurrency === validCurrency;
};
