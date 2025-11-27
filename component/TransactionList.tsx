import React from 'react';
import { Trash2, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { CURRENCY_FORMATTER } from '../constants';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDeleteTransaction }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="text-slate-400" size={32} />
        </div>
        <h3 className="text-slate-900 font-medium text-lg">Belum ada transaksi</h3>
        <p className="text-slate-500 mt-1">Transaksi yang Anda tambahkan akan muncul di sini.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-lg font-bold text-slate-800">Riwayat Transaksi</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
              <th className="px-6 py-3 font-semibold">Tanggal</th>
              <th className="px-6 py-3 font-semibold">Kategori</th>
              <th className="px-6 py-3 font-semibold">Catatan</th>
              <th className="px-6 py-3 font-semibold text-right">Jumlah</th>
              <th className="px-6 py-3 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                  {new Date(t.date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    t.type === TransactionType.INCOME 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                     {t.type === TransactionType.INCOME ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                     {t.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                  {t.note || '-'}
                </td>
                <td className={`px-6 py-4 text-sm font-semibold text-right whitespace-nowrap ${
                  t.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'
                }`}>
                  {t.type === TransactionType.INCOME ? '+ ' : '- '}
                  {CURRENCY_FORMATTER.format(t.amount)}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onDeleteTransaction(t.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Hapus Transaksi"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;