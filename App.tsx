
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

  // Auto-set meal time based on hour
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) setSelectedMeal(MealTime.BREAKFAST);
    else if (hour >= 10 && hour < 14) setSelectedMeal(MealTime.LUNCH);
    else setSelectedMeal(MealTime.DINNER);
  }, []);

  const handleShake = useCallback(async () => {
    if (isShaking || loading) return;

    setIsShaking(true);
    
    // Simulate shaking animation duration
    setTimeout(async () => {
      setIsShaking(false);
      setLoading(true);

      const foods = FOOD_DATABASE[selectedCity][selectedMeal];
      const randomFood = foods[Math.floor(Math.random() * foods.length)];
      const randomLuck = LUCK_LEVELS[Math.floor(Math.random() * LUCK_LEVELS.length)];
      
      const wisdom = await getPhDFortune(randomFood, selectedCity, selectedMeal);
      
      setResult({
        luck: randomLuck,
        food: randomFood,
        wisdom: wisdom
      });
      setLoading(false);
    }, 1500);
  }, [isShaking, loading, selectedCity, selectedMeal]);

  // Accelerometer support for actual shaking
  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const threshold = 15;
      const x = acceleration.x || 0;
      const y = acceleration.y || 0;
      const z = acceleration.z || 0;

      if (Math.abs(x) > threshold || Math.abs(y) > threshold || Math.abs(z) > threshold) {
        handleShake();
      }
    };

    if (window.DeviceMotionEvent) {
        // Request permission for iOS 13+
        if ((typeof DeviceMotionEvent as any).requestPermission === 'function') {
            (DeviceMotionEvent as any).requestPermission();
        }
        window.addEventListener('devicemotion', handleMotion);
    }
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [handleShake]);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col p-6 font-sans">
      {/* Header */}
      <header className="mb-8 text-center pt-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">博食灵签</h1>
        <p className="text-slate-500 text-sm mt-1">博士生食堂决策玄学系统 v1.1</p>
      </header>

      {/* Selectors */}
      <section className="space-y-6 mb-12">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">选择校区/城市</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.values(City).map(city => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`py-2 rounded-xl text-sm font-bold transition-all ${
                  selectedCity === city 
                    ? 'bg-red-600 text-white shadow-md scale-105' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-red-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">当前时段</label>
          <div className="flex gap-2">
            {Object.values(MealTime).map(meal => (
              <button
                key={meal}
                onClick={() => setSelectedMeal(meal)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                  selectedMeal === meal 
                    ? 'bg-slate-800 text-white shadow-md' 
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {meal}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Fortune Box Area */}
      <section className="flex-1 flex flex-col items-center justify-center space-y-8 py-10">
        <StickBox isShaking={isShaking} />
        
        <div className="text-center">
            <p className="text-slate-400 text-xs font-medium animate-pulse">
                {isShaking ? '灵签正在感应...' : '摇动手机或点击下方按钮抽签'}
            </p>
        </div>

        <button
          onClick={handleShake}
          disabled={isShaking || loading}
          className={`group relative w-full py-5 rounded-2xl font-black text-xl tracking-widest transition-all ${
            isShaking || loading
              ? 'bg-slate-200 text-slate-400'
              : 'bg-red-600 text-white shadow-xl hover:bg-red-700 active:scale-95 shadow-red-200'
          }`}
        >
          {loading ? '正在解析天机...' : '求取今日博食'}
          <span className="absolute -top-3 -right-3 bg-yellow-400 text-red-700 text-[10px] px-2 py-1 rounded-full border-2 border-white shadow-sm font-black">
            必出上上签
          </span>
        </button>
      </section>

      {/* Footer Info */}
      <footer className="mt-8 text-center pb-6">
        <p className="text-[10px] text-slate-300 uppercase tracking-[0.2em]">
          Design for PhDs · No more decision fatigue
        </p>
      </footer>

      {/* Modals */}
      <ResultModal result={result} onClose={() => setResult(null)} />
      
      {/* Global Loading Spinner for API call */}
      {loading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/40 backdrop-blur-sm">
           <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default App;
