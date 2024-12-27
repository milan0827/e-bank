export interface CreateAccountArgs {
  fullName: string;
  balance: number;
  currency: CurrencyType;
}

export interface CurrencyType {
  NRS: 'NRS';
  EURO: 'EURO';
  USD: 'USD';
}
