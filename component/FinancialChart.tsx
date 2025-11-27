import React, { useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { CURRENCY_FORMATTER } from '../constants';
import { BarChart3 } from 'lucide-react';

interface FinancialChartProps {
  transactions: Transaction[];
  totalExpense: number;
}

const FinancialChart: React.FC<FinancialChartProps> = ({ transactions, totalExpense }) => {
  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE);
    const grouped: Record<string, number> = {};

    expenses.forEach(t => {
      grouped[t.category] = (grouped[t.category] || 0) + t.amount;
    });

    return Object.entries(grouped)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount); // Sort highest first
  }, [transactions, totalExpense]);

  if (categoryData.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <BarChart3 size={20} className="text-indigo-600" />
        Analisis Pengeluaran
      </h2>
      
      <div className="space-y-5">
        {categoryData.map((item) => (
          <div key={item.category}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-medium text-slate-700">{item.category}</span>
              <span className="text-slate-500">
                {CURRENCY_FORMATTER.format(item.amount)} <span className="text-xs ml-1 bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">({item.percentage.toFixed(1)}%)</span>
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialChart;
