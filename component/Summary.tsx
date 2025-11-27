import React from 'react';
import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react';
import { SummaryData } from '../types';
import { CURRENCY_FORMATTER } from '../constants';

interface SummaryProps {
  data: SummaryData;
}

const Summary: React.FC<SummaryProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Pemasukan */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
        <div className="p-3 bg-green-100 text-green-600 rounded-full">
          <ArrowDownCircle size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Total Pemasukan</p>
          <p className="text-xl font-bold text-slate-800">
            {CURRENCY_FORMATTER.format(data.totalIncome)}
          </p>
        </div>
      </div>

      {/* Pengeluaran */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
        <div className="p-3 bg-red-100 text-red-600 rounded-full">
          <ArrowUpCircle size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Total Pengeluaran</p>
          <p className="text-xl font-bold text-slate-800">
            {CURRENCY_FORMATTER.format(data.totalExpense)}
          </p>
        </div>
      </div>

      {/* Saldo */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
          <Wallet size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Sisa Saldo</p>
          <p className={`text-xl font-bold ${data.balance < 0 ? 'text-red-600' : 'text-slate-800'}`}>
            {CURRENCY_FORMATTER.format(data.balance)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Summary;