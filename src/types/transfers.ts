export interface CreateTransferParams {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  currency: 'NRS' | 'EURO' | 'USD';
}
