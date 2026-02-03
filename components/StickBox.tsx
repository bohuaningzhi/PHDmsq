
import React from 'react';

interface StickBoxProps {
  isShaking: boolean;
}

const StickBox: React.FC<StickBoxProps> = ({ isShaking }) => {
  return (
    <div className={`relative w-48 h-64 mx-auto ${isShaking ? 'animate-bounce' : ''}`}>
      {/* The Box Body */}
      <div className="absolute bottom-0 left-0 w-full h-4/5 bg-red-700 rounded-t-xl border-4 border-yellow-500 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]"></div>
        <div className="flex items-center justify-center h-full">
            <span className="text-yellow-400 font-bold text-4xl transform rotate-180 [writing-mode:vertical-rl]">博食灵签</span>
        </div>
      </div>
      
      {/* The Sticks */}
      <div className={`absolute top-0 left-4 right-4 h-full flex justify-around transition-transform duration-100 ${isShaking ? 'translate-y-2' : '-translate-y-4'}`}>
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="w-2 bg-yellow-400 rounded-full border border-yellow-600 shadow-sm origin-bottom"
            style={{ 
              height: `${70 + Math.random() * 20}%`,
              transform: `rotate(${(i - 3.5) * 5}deg)`
            }}
          >
             <div className="h-4 w-full bg-red-600 mt-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StickBox;
