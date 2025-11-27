export enum TransactionType {
  INCOME = 'Pemasukan',
  EXPENSE = 'Pengeluaran',
}

export interface Transaction {
  id: string;
  date: string; // ISO Date string YYYY-MM-DD
  type: TransactionType;
  category: string;
  amount: number;
  note: string;
  createdAt: number;
}

export interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isPro: boolean;
}
