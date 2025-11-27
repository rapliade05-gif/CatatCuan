import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType, SummaryData, User } from './types';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Summary from './components/Summary';
import FinancialChart from './components/FinancialChart';
import LoginScreen from './components/LoginScreen';
import SubscriptionModal from './components/SubscriptionModal';
import { MONTHS } from './constants';
import { WalletCards, LogOut, Download, Cloud, Crown, User as UserIcon } from 'lucide-react';

const STORAGE_KEY = 'transaksiKeuangan';
const USER_KEY = 'userKeuangan';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Filter state
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());

  // Load from local storage on mount
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    
    if (storedData) {
      try {
        setTransactions(JSON.parse(storedData));
      } catch (e) {
        console.error("Gagal memuat data dari localStorage", e);
      }
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Gagal memuat user", e);
      }
    }

    setLoading(false);
  }, []);

  // Save to local storage whenever transactions change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
  }, [transactions, loading]);

  // Save user when changed
  useEffect(() => {
    if (!loading && user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else if (!loading && !user) {
      localStorage.removeItem(USER_KEY);
    }
  }, [user, loading]);

  const handleLogin = (provider: 'google' | 'email') => {
    // Simulasi Login
    const mockUser: User = {
      id: 'user_123',
      name: provider === 'google' ? 'Pengguna Google' : 'Pengguna Email',
      email: provider === 'google' ? 'user@gmail.com' : 'user@email.com',
      isPro: false,
      avatar: provider === 'google' ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' : undefined
    };
    setUser(mockUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleSubscribe = () => {
    if (user) {
      setUser({ ...user, isPro: true });
      setIsProModalOpen(false);
      alert('Terima kasih! Anda sekarang adalah member PRO.');
    }
  };

  const handleSync = () => {
    if (!user?.isPro) {
      setIsProModalOpen(true);
      return;
    }
    setIsSyncing(true);
    // Simulasi Sync
    setTimeout(() => {
      setIsSyncing(false);
      alert('Data berhasil disinkronisasi ke cloud!');
    }, 2000);
  };

  const handleExport = () => {
    if (!user?.isPro) {
      setIsProModalOpen(true);
      return;
    }
    
    // Generate CSV
    const headers = ['Tanggal', 'Jenis', 'Kategori', 'Jumlah', 'Catatan'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        t.date,
        t.type,
        t.category,
        t.amount,
        `"${t.note || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan_keuangan_${MONTHS[selectedMonth]}_${selectedYear}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  // Filter logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, selectedMonth, selectedYear]);

  // Summary calculation
  const summary: SummaryData = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, t) => {
        if (t.type === TransactionType.INCOME) {
          acc.totalIncome += t.amount;
          acc.balance += t.amount;
        } else {
          acc.totalExpense += t.amount;
          acc.balance -= t.amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0, balance: 0 }
    );
  }, [filteredTransactions]);

  // Generate Year Options
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  }, []);

  if (loading) return null;

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen pb-12 bg-slate-50">
      <SubscriptionModal 
        isOpen={isProModalOpen} 
        onClose={() => setIsProModalOpen(false)} 
        onSubscribe={handleSubscribe} 
      />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <WalletCards size={24} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800 leading-tight">Catatan Keuangan</h1>
                {user.isPro ? (
                  <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold flex items-center w-fit gap-1 border border-yellow-200">
                    <Crown size={10} fill="currentColor" /> PRO MEMBER
                  </span>
                ) : (
                  <button onClick={() => setIsProModalOpen(true)} className="text-[10px] text-indigo-600 font-bold hover:underline">
                    UPGRADE KE PRO
                  </button>
                )}
              </div>
            </div>
            
            {/* Mobile User Menu Toggle (Simplified for this demo) */}
            <div className="sm:hidden flex items-center gap-2">
              <button onClick={handleLogout} className="p-2 text-slate-400">
                <LogOut size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Sync Button */}
            <button 
              onClick={handleSync}
              className={`p-2 rounded-lg border transition-all relative ${
                isSyncing ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
              title="Sinkronisasi Cloud"
            >
              <Cloud size={20} className={isSyncing ? 'animate-pulse' : ''} />
              {!user.isPro && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-white"></div>
              )}
            </button>

            {/* Filter */}
            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200 flex-1 sm:flex-none">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-transparent text-sm px-2 py-1.5 focus:outline-none text-slate-700 font-medium flex-1 cursor-pointer"
              >
                {MONTHS.map((month, index) => (
                  <option key={month} value={index}>{month}</option>
                ))}
              </select>
              <div className="w-px h-4 bg-slate-300"></div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-transparent text-sm px-2 py-1.5 focus:outline-none text-slate-700 font-medium cursor-pointer"
              >
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* User Profile Desktop */}
            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500 truncate max-w-[120px]">{user.email}</p>
              </div>
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-9 h-9 rounded-full bg-slate-200 border border-slate-200" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <UserIcon size={18} />
                </div>
              )}
              <button 
                onClick={handleLogout}
                className="ml-2 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Keluar"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Summary data={summary} />

        {/* Financial Bar Chart (Bar Keuangan) */}
        <FinancialChart transactions={filteredTransactions} totalExpense={summary.totalExpense} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TransactionForm onAddTransaction={handleAddTransaction} />
          </div>
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">Riwayat Transaksi</h2>
              
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm"
              >
                <Download size={16} />
                Export Excel
                {!user.isPro && <Crown size={12} className="text-yellow-500" fill="currentColor" />}
              </button>
            </div>
            <TransactionList 
              transactions={filteredTransactions} 
              onDeleteTransaction={handleDeleteTransaction} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
