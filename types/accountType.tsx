export interface CreateAccountArgs {
  fullName: string;
  balance: number;
  currency: 'NRS' | 'EURO' | 'USD';
}
