import React from 'react';
import { CheckCircle2, Crown, X, Zap } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onSubscribe }) => {
  if (!isOpen) return null;

  const features = [
    "Sinkronisasi Cloud Antar Perangkat",
    "Export Laporan ke Excel (.csv)",
    "Laporan Analisis Mendalam",
    "Pengingat Budget Harian",
    "Tanpa Iklan"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-white/50 rounded-full z-10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="relative">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
              <Crown size={32} className="text-yellow-300" fill="currentColor" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Upgrade ke PRO</h2>
            <p className="text-indigo-100">Buka potensi penuh keuangan Anda</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <span className="text-4xl font-bold text-slate-800">$5</span>
            <span className="text-slate-500">/bulan</span>
          </div>

          <div className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                <span className="text-slate-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={onSubscribe}
            className="w-full py-3.5 px-6 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
          >
            <Zap size={20} className="text-yellow-400" fill="currentColor" />
            Berlangganan Sekarang
          </button>
          
          <p className="text-center text-xs text-slate-400 mt-4">
            Batalkan kapan saja. Syarat dan ketentuan berlaku.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
