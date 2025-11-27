import { TransactionType } from './types';

export const INCOME_CATEGORIES = [
  'Gaji',
  'Bonus',
  'Penjualan',
  'Investasi',
  'Lainnya',
];

export const EXPENSE_CATEGORIES = [
  'Makan & Minum',
  'Transportasi',
  'Belanja',
  'Tagihan & Utilitas',
  'Hiburan',
  'Kesehatan',
  'Pendidikan',
  'Lainnya',
];

export const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const CURRENCY_FORMATTER = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});