import React from 'react';

interface StickBoxProps {
  isShaking: boolean;
}

const StickBox: React.FC<StickBoxProps> = ({ isShaking }) => {
  return (
    <div className={`relative w-48 h-72 mx-auto ${isShaking ? 'animate-[bounce_0.2s_infinite]' : ''}`}>
      {/* 签筒阴影 */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/10 blur-xl rounded-full"></div>
      
      {/* 签筒主体 */}
      <div className="absolute bottom-0 left-0 w-full h-4/5 bg-gradient-to-b from-red-600 to-red-800 rounded-t-2xl border-x-4 border-t-4 border-yellow-500 shadow-2xl overflow-hidden">
        {/* 纹理 */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/woven.png')]"></div>
        
        {/* 装饰边框 */}
        <div className="absolute top-4 left-4 right-4 bottom-4 border border-yellow-500/30 rounded-t-lg"></div>
        
        <div className="flex flex-col items-center justify-center h-full relative z-10">
            <span className="text-yellow-400 font-black text-3xl [writing-mode:vertical-rl] tracking-[0.5em] drop-shadow-md">
              博食灵签
            </span>
            <div className="mt-2 w-8 h-8 rounded-full border-2 border-yellow-500 flex items-center justify-center">
              <span className="text-yellow-500 text-[10px] font-bold">PhD</span>
            </div>
        </div>
      </div>
      
      {/* 灵签木条 */}
      <div className={`absolute top-0 left-4 right-4 h-full flex justify-around transition-transform duration-150 ${isShaking ? 'translate-y-4' : '-translate-y-6'}`}>
        {[...Array(9)].map((_, i) => (
          <div 
            key={i} 
            className="w-2.5 bg-[#f3d9a2] rounded-full border border-[#d4b475] shadow-sm origin-bottom transition-all"
            style={{ 
              height: `${65 + (i % 3) * 10}%`,
              transform: `rotate(${(i - 4) * 6}deg) ${isShaking ? `translateY(${Math.sin(Date.now() + i) * 10}px)` : ''}`,
              zIndex: 5
            }}
          >
             {/* 签头红漆 */}
             <div className="h-6 w-full bg-red-600 rounded-t-full mt-1"></div>
             {/* 签面刻字模拟 */}
             <div className="mt-4 flex flex-col items-center gap-1 opacity-40">
                <div className="w-0.5 h-4 bg-slate-800"></div>
                <div className="w-0.5 h-2 bg-slate-800"></div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StickBox;