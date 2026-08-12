import React, { useState, useEffect, useCallback } from 'react';
import { City, MealTime, PhDMajor, FortuneResult } from './types';
import { FOOD_DATABASE, LUCK_LEVELS } from './constants';
import StickBox from './components/StickBox';
import ResultModal from './components/ResultModal';
import { getPhDFortune } from './services/geminiService';

const HISTORY_KEY = 'phd_oracle_history_v1';

const App: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<City>(City.BEIJING);
  const [selectedMeal, setSelectedMeal] = useState<MealTime>(MealTime.LUNCH);
  const [selectedMajor, setSelectedMajor] = useState<PhDMajor>(PhDMajor.HYDRO);
  const [isShaking, setIsShaking] = useState(false);
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<FortuneResult[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // 根据时间和城市自动初始化合适选项
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) setSelectedMeal(MealTime.BREAKFAST);
    else if (hour >= 10 && hour < 14) setSelectedMeal(MealTime.LUNCH);
    else setSelectedMeal(MealTime.DINNER);

    // 读取本地灵签历史
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // 城市切换时，根据城市智能推荐专业方向
  useEffect(() => {
    if (selectedCity === City.BEIJING) {
      setSelectedMajor(PhDMajor.HYDRO); // 北京默认设为水利/环境/海淀圈
    } else if (selectedCity === City.LANZHOU) {
      setSelectedMajor(PhDMajor.PHYS_MATH);
    } else if (selectedCity === City.HARBIN) {
      setSelectedMajor(PhDMajor.MECH_CIVIL);
    } else if (selectedCity === City.XIAN) {
      setSelectedMajor(PhDMajor.CS_AI);
    } else if (selectedCity === City.TIANJIN) {
      setSelectedMajor(PhDMajor.BIO_CHEM);
    }
  }, [selectedCity]);

  const saveToHistory = (item: FortuneResult) => {
    const updated = [item, ...history.slice(0, 19)];
    setHistory(updated);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleShake = useCallback(async () => {
    if (isShaking || loading) return;

    setIsShaking(true);
    
    setTimeout(async () => {
      setIsShaking(false);
      setLoading(true);

      try {
        const foods = FOOD_DATABASE[selectedCity][selectedMeal];
        const randomFood = foods[Math.floor(Math.random() * foods.length)];
        const randomLuck = LUCK_LEVELS[Math.floor(Math.random() * LUCK_LEVELS.length)];
        
        // 智能 AI / 本地多维推理生成灵签
        const fortuneDetail = await getPhDFortune(
          randomFood, 
          selectedCity, 
          selectedMeal, 
          randomLuck, 
          selectedMajor
        );
        
        const newResult: FortuneResult = {
          luck: randomLuck,
          food: randomFood,
          detail: fortuneDetail,
          major: selectedMajor,
          city: selectedCity,
          mealTime: selectedMeal,
          timestamp: Date.now()
        };

        setResult(newResult);
        saveToHistory(newResult);
      } catch (e) {
        console.error("Shake handle error:", e);
      } finally {
        setLoading(false);
      }
    }, 1100);
  }, [isShaking, loading, selectedCity, selectedMeal, selectedMajor, history]);

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col p-5 relative pb-10">
      {/* 顶栏装饰红线 */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 z-50"></div>
      
      {/* Header */}
      <header className="mb-6 text-center pt-6 relative">
        <button
          onClick={() => setShowHistoryModal(true)}
          className="absolute right-0 top-6 px-2.5 py-1 text-[11px] font-bold text-slate-600 bg-white border border-slate-200 rounded-full shadow-sm hover:border-red-300 flex items-center gap-1 transition-all"
        >
          <span>📜 历次签文 ({history.length})</span>
        </button>

        <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center justify-center gap-2">
          <span className="bg-red-600 text-white px-2 py-0.5 rounded shadow-lg shadow-red-200">博</span>
          <span className="text-slate-800">食灵签</span>
        </h1>
        <div className="flex items-center justify-center gap-2 text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1">
          <span className="w-6 h-[1px] bg-slate-200"></span>
          <span>Ph.D Gourmet AI Oracle v2.0</span>
          <span className="w-6 h-[1px] bg-slate-200"></span>
        </div>
      </header>

      {/* Control Panel: City, Major & Meal */}
      <section className="bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-white shadow-xl shadow-slate-200/50 mb-6 space-y-4">
        {/* City Selector */}
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            1. 科研据点 / City
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {Object.values(City).map(city => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                  selectedCity === city 
                    ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-200 -translate-y-0.5' 
                    : 'bg-white text-slate-600 border-slate-100 hover:border-red-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
          {selectedCity === City.BEIJING && (
            <div className="mt-2 p-2 bg-red-50/80 border border-red-100 rounded-xl text-[11px] text-red-700 font-medium flex items-center gap-1.5 animate-in fade-in">
              <span className="shrink-0 text-red-500">📍</span>
              <span>含中国水利水电科学研究院（水科院/增光路/车公庄）及海淀高校圈美食</span>
            </div>
          )}
        </div>

        {/* PhD Major Selector */}
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            2. 学术领域 / Major
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.values(PhDMajor).map(major => (
              <button
                key={major}
                onClick={() => setSelectedMajor(major)}
                className={`py-2 px-2.5 rounded-xl text-[11px] font-bold text-left transition-all border-2 truncate ${
                  selectedMajor === major 
                    ? 'bg-slate-800 text-white border-slate-800 shadow-md shadow-slate-200 -translate-y-0.5' 
                    : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300'
                }`}
              >
                🎓 {major}
              </button>
            ))}
          </div>
        </div>

        {/* Meal Time Selector */}
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
            3. 生理节律 / Meal
          </label>
          <div className="flex gap-1.5">
            {Object.values(MealTime).map(meal => (
              <button
                key={meal}
                onClick={() => setSelectedMeal(meal)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                  selectedMeal === meal 
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-100 -translate-y-0.5' 
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
      <section className="flex-1 flex flex-col items-center justify-center py-2 relative">
        <StickBox isShaking={isShaking} />
        
        <div className="mt-8 text-center h-8">
            <p className={`text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] ${isShaking ? 'animate-pulse text-red-500' : ''}`}>
                {isShaking ? '✨ 正在计算因果律与学术运势...' : '摇动手机或点击“掷签求食”'}
            </p>
        </div>

        <div className="w-full px-2 mt-2">
          <button
            onClick={handleShake}
            disabled={isShaking || loading}
            className={`group relative w-full py-4 rounded-2xl font-black text-lg tracking-[0.3em] transition-all overflow-hidden ${
              isShaking || loading
                ? 'bg-slate-200 text-slate-400 scale-95'
                : 'bg-red-600 text-white shadow-2xl hover:bg-red-700 active:scale-95 shadow-red-200'
            }`}
          >
            <div className="relative z-10 flex items-center justify-center gap-2">
               {loading ? '🔮 解签中...' : '掷签求食'}
            </div>
            {!isShaking && !loading && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            )}
          </button>
        </div>
      </section>

      {/* Modals */}
      <ResultModal result={result} onClose={() => setResult(null)} />

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <span>📜 我的求签历史</span>
                <span className="text-xs font-normal text-slate-400">({history.length}条)</span>
              </h3>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {history.length === 0 ? (
                <p className="text-center text-slate-400 text-xs py-10">暂无求签记录，快去掷签求食吧！</p>
              ) : (
                history.map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                      setResult(item);
                      setShowHistoryModal(false);
                    }}
                    className="p-3 bg-slate-50 hover:bg-red-50/60 border border-slate-100 rounded-2xl cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-red-600">{item.luck}</span>
                        <span className="text-xs font-bold text-slate-800">{item.food.name}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {item.city} · {item.major} · {item.detail.title}
                      </p>
                    </div>
                    <span className="text-[10px] text-red-600 font-bold bg-white px-2 py-1 rounded-full border border-red-100">
                      查看 ➔
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="py-2 px-6 bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Global Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="relative">
              <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-8 h-8 border-4 border-amber-500/20 border-b-amber-500 rounded-full animate-spin-slow"></div>
              </div>
           </div>
           <p className="mt-4 text-white font-black text-xs tracking-widest animate-pulse">
             正在通过 AI 博士导师大模型推算签文...
           </p>
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
