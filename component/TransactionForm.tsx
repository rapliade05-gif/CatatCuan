import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);

    if (!date) {
      setError('Tanggal wajib diisi.');
      return;
    }
    if (!category) {
      setError('Kategori wajib dipilih.');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Jumlah harus berupa angka lebih dari 0.');
      return;
    }

    onAddTransaction({
      date,
      type,
      category,
      amount: parsedAmount,
      note,
    });

    // Reset form mostly, keep date
    setAmount('');
    setNote('');
    // Keep the current type and maybe reset category or keep it
    setCategory('');
  };

  const categories = type === TransactionType.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <PlusCircle size={20} className="text-blue-600" />
        Tambah Transaksi Baru
      </h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tipe Transaksi */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Transaksi</label>
            <div className="flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => { setType(TransactionType.EXPENSE); setCategory(''); }}
                className={`px-4 py-2 text-sm font-medium flex-1 rounded-l-lg border ${
                  type === TransactionType.EXPENSE
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Pengeluaran
              </button>
              <button
                type="button"
                onClick={() => { setType(TransactionType.INCOME); setCategory(''); }}
                className={`px-4 py-2 text-sm font-medium flex-1 rounded-r-lg border ${
                  type === TransactionType.INCOME
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Pemasukan
              </button>
            </div>
          </div>

          {/* Tanggal */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border-slate-300 border px-3 py-2 text-slate-900 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors shadow-sm"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Kategori */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border-slate-300 border px-3 py-2 text-slate-900 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors shadow-sm bg-white"
            >
              <option value="" disabled>Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Jumlah */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">Jumlah (Rp)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full rounded-lg border-slate-300 border px-3 py-2 text-slate-900 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors shadow-sm"
            />
          </div>
        </div>

        {/* Catatan */}
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-slate-700 mb-1">Catatan (Opsional)</label>
          <input
            type="text"
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Keterangan tambahan..."
            className="w-full rounded-lg border-slate-300 border px-3 py-2 text-slate-900 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors shadow-sm"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all shadow-sm flex justify-center items-center gap-2"
          >
            <PlusCircle size={18} />
            Simpan Transaksi
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;