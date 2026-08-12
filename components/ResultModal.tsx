
import React from 'react';
import { FortuneResult } from '../types';

interface ResultModalProps {
  result: FortuneResult | null;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ result, onClose }) => {
  if (!result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl transform animate-in zoom-in slide-in-from-bottom-10 duration-500">
        <div className="bg-red-600 p-6 text-center text-white relative">
          <div className="absolute top-4 right-4">
            <button onClick={onClose} className="text-white/80 hover:text-white text-2xl">✕</button>
          </div>
          <div className="text-sm font-medium opacity-80 mb-1">您的今日灵签</div>
          <h2 className="text-5xl font-black tracking-widest text-yellow-300">{result.luck}</h2>
        </div>
        
        <div className="p-8">
          <div className="flex flex-col items-center mb-6">
             <div className="text-xs font-bold text-red-600 px-3 py-1 border border-red-600 rounded-full mb-3 tracking-widest uppercase">
                Recommendation
             </div>
             <h3 className="text-3xl font-bold text-slate-800 mb-2">{result.food.name}</h3>
             <p className="text-slate-500 text-center italic">"{result.food.description}"</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6">
            <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-tighter">PhD Wisdom · 博士箴言</h4>
            <p className="text-slate-700 leading-relaxed font-medium">
              {result.wisdom}
            </p>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-2 text-sm text-slate-600">
               <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
               <span>{result.food.phdNote}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.food.tags.map(tag => (
                <span 
                  key={tag} 
                  className={`text-[10px] px-2 py-0.5 rounded border font-bold ${
                    tag === '水科院'
                      ? 'bg-blue-100 text-blue-900 border-blue-200 shadow-sm'
                      : tag === '海淀区' 
                      ? 'bg-amber-100 text-amber-900 border-amber-200' 
                      : 'bg-red-50 text-red-700 border-red-100'
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg transition-transform active:scale-95"
          >
            领旨谢恩
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
