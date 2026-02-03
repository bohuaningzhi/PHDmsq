import React, { useState, useEffect, useCallback } from 'react';
import { City, MealTime, FortuneResult } from './types';
import { FOOD_DATABASE, LUCK_LEVELS } from './constants';
import StickBox from './components/StickBox';
import ResultModal from './components/ResultModal';
import { getPhDFortune } from './services/geminiService';

const App: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<City>(City.BEIJING);
  const [selectedMeal, setSelectedMeal] = useState<MealTime>(MealTime.LUNCH);
  const [isShaking, setIsShaking] = useState(false);
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) setSelectedMeal(MealTime.BREAKFAST);
    else if (hour >= 10 && hour < 14) setSelectedMeal(MealTime.LUNCH);
    else setSelectedMeal(MealTime.DINNER);
  }, []);

  const handleShake = useCallback(async () => {
    if (isShaking || loading) return;

    setIsShaking(true);
    
    // 模拟摇晃时间
    setTimeout(async () => {
      setIsShaking(false);
      setLoading(true);

      try {
        const foods = FOOD_DATABASE[selectedCity][selectedMeal];
        const randomFood = foods[Math.floor(Math.random() * foods.length)];
        const randomLuck = LUCK_LEVELS[Math.floor(Math.random() * LUCK_LEVELS.length)];
        
        const wisdom = await getPhDFortune(randomFood, selectedCity, selectedMeal);
        
        setResult({
          luck: randomLuck,
          food: randomFood,
          wisdom: wisdom
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 1200);
  }, [isShaking, loading, selectedCity, selectedMeal]);

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col p-6 relative">
      {/* 装饰背景元素 */}
      <div className="fixed top-0 left-0 w-full h-1 bg-red-600 z-50"></div>
      
      {/* Header */}
      <header className="mb-8 text-center pt-8 space-y-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center justify-center gap-2">
          <span className="bg-red-600 text-white px-2 py-0.5 rounded shadow-lg">博</span>
          <span className="text-slate-800">食灵签</span>
        </h1>
        <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          <span className="w-8 h-[1px] bg-slate-200"></span>
          <span>Ph.D Gourmet Oracle v1.2</span>
          <span className="w-8 h-[1px] bg-slate-200"></span>
        </div>
      </header>

      {/* Selectors */}
      <section className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-white shadow-xl shadow-slate-200/50 mb-8">
        <div className="mb-6">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <div className="w-1 h-1 bg-red-500 rounded-full"></div>
            选择科研据点 / City
          </label>
          <div className="grid grid-cols-3 gap-2">
            {Object.values(City).map(city => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all border-2 ${
                  selectedCity === city 
                    ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-200 -translate-y-0.5' 
                    : 'bg-white text-slate-600 border-slate-100 hover:border-red-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
            当前生理节律 / Period
          </label>
          <div className="flex gap-2">
            {Object.values(MealTime).map(meal => (
              <button
                key={meal}
                onClick={() => setSelectedMeal(meal)}
                className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border-2 ${
                  selectedMeal === meal 
                    ? 'bg-slate-800 text-white border-slate-800 shadow-lg shadow-slate-200 -translate-y-0.5' 
                    : 'bg-white text-slate-600 border-slate-100'
                }`}
              >
                {meal}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Fortune Box Area */}
      <section className="flex-1 flex flex-col items-center justify-center py-4 relative">
        <StickBox isShaking={isShaking} />
        
        <div className="mt-12 text-center h-8">
            <p className={`text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] ${isShaking ? 'animate-pulse' : ''}`}>
                {isShaking ? '正在推算因果律...' : '摇动手机或点击求签'}
            </p>
        </div>

        <div className="w-full px-4 mt-4">
          <button
            onClick={handleShake}
            disabled={isShaking || loading}
            className={`group relative w-full py-5 rounded-2xl font-black text-xl tracking-[0.3em] transition-all overflow-hidden ${
              isShaking || loading
                ? 'bg-slate-200 text-slate-400 scale-95'
                : 'bg-red-600 text-white shadow-2xl hover:bg-red-700 active:scale-95'
            }`}
          >
            <div className="relative z-10 flex items-center justify-center gap-2">
               {loading ? '解析中...' : '掷签求食'}
            </div>
            {/* 按钮光效 */}
            {!isShaking && !loading && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            )}
          </button>
        </div>
      </section>

      {/* Footer Info */}
      <footer className="mt-8 text-center pb-6">
        <div className="flex flex-col items-center gap-1">
          <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.3em]">
            Stochastic Decision System for PhD
          </p>
          <div className="w-1 h-1 bg-red-300 rounded-full"></div>
        </div>
      </footer>

      {/* Modals */}
      <ResultModal result={result} onClose={() => setResult(null)} />
      
      {/* Global Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
           <div className="relative">
              <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-8 h-8 border-4 border-yellow-500/20 border-b-yellow-500 rounded-full animate-spin-slow"></div>
              </div>
           </div>
           <p className="mt-4 text-white font-black text-xs tracking-widest animate-pulse">正在向导师模型申请预算...</p>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default App;