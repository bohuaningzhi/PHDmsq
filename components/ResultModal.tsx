import React, { useState } from 'react';
import { FortuneResult } from '../types';
import { askPhDMentor } from '../services/geminiService';

interface ResultModalProps {
  result: FortuneResult | null;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ result, onClose }) => {
  const [activeTab, setActiveTab] = useState<'fortune' | 'chat'>('fortune');
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'model'; text: string }>>([
    { role: 'model', text: '同学你好！我是你的 AI 博士导师。今天抽到的这道灵签可有疑惑？或者科研、论文、答辩有任何烦恼，尽管问我！' }
  ]);
  const [asking, setAsking] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleAsk = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!question.trim() || asking) return;

    const userQ = question.trim();
    setQuestion('');
    const newHistory = [...chatHistory, { role: 'user' as const, text: userQ }];
    setChatHistory(newHistory);
    setAsking(true);

    try {
      const answer = await askPhDMentor(userQ, result, newHistory);
      setChatHistory([...newHistory, { role: 'model', text: answer }]);
    } catch (err) {
      console.error(err);
      setChatHistory([...newHistory, { role: 'model', text: '刚才信号波动，但这顿吃饱了，科研什么关卡都能冲过去！' }]);
    } finally {
      setAsking(false);
    }
  };

  const handleCopyCard = () => {
    const textToCopy = `【博食灵签】今日灵签：${result.luck} - ${result.detail.title}
📍 城市：${result.city} (${result.major})
🍲 推荐美食：${result.food.name}
📝 签文点评：${result.detail.wisdom}
✨ ${result.detail.yi} | ${result.detail.ji}
🚀 论文提升：${result.detail.paperBoost}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl transform animate-in zoom-in slide-in-from-bottom-10 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-amber-700 p-5 text-center text-white relative shrink-0">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl bg-black/20 hover:bg-black/40 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          >
            ✕
          </button>
          
          <div className="text-[10px] font-bold tracking-widest opacity-80 uppercase mb-1 flex items-center justify-center gap-1">
            <span>{result.city}</span> · <span>{result.major}</span>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl font-black text-yellow-300 tracking-wider drop-shadow">{result.luck}</span>
          </div>

          <div className="mt-1 text-xs font-bold text-amber-200 bg-black/20 inline-block px-3 py-0.5 rounded-full backdrop-blur-sm">
            {result.detail.title}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50 shrink-0">
          <button
            onClick={() => setActiveTab('fortune')}
            className={`flex-1 py-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border-b-2 ${
              activeTab === 'fortune' 
                ? 'border-red-600 text-red-600 bg-white' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <span>📜 灵签详解</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border-b-2 ${
              activeTab === 'chat' 
                ? 'border-red-600 text-red-600 bg-white' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <span>💬 博导 AI 解签助手</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          </button>
        </div>

        {/* Tab 1: Fortune Content */}
        {activeTab === 'fortune' && (
          <div className="p-6 overflow-y-auto space-y-4 text-left">
            {/* Food Badge & Name */}
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 text-center">
              <span className="text-[10px] font-black text-amber-700 bg-amber-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                今日推荐美食
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">{result.food.name}</h3>
              <p className="text-xs text-slate-600 mt-1 italic">"{result.food.description}"</p>
            </div>

            {/* AI Generated Wisdom Box */}
            <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl relative shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span>
                  博士箴言 · PhD Wisdom
                </span>
                <span className="text-[9px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {result.detail.isAIGenerated ? '✨ AI 智能推理' : '⚡ 算法灵签'}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-200 font-medium">
                {result.detail.wisdom}
              </p>
            </div>

            {/* Yi & Ji Cards */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl font-bold flex items-center gap-1.5">
                <span className="text-emerald-600 font-black text-sm">宜</span>
                <span className="truncate">{result.detail.yi}</span>
              </div>
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl font-bold flex items-center gap-1.5">
                <span className="text-rose-600 font-black text-sm">忌</span>
                <span className="truncate">{result.detail.ji}</span>
              </div>
            </div>

            {/* Paper Boost Stat */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-3 rounded-xl border border-red-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600">🚀 科研加成收益:</span>
              <span className="font-black text-red-600">{result.detail.paperBoost}</span>
            </div>

            {/* Tags & PhD Note */}
            <div className="space-y-2 pt-1">
              <div className="flex flex-wrap gap-1.5">
                {result.food.tags.map(tag => (
                  <span 
                    key={tag} 
                    className={`text-[10px] px-2 py-0.5 rounded border font-bold ${
                      tag === '水科院'
                        ? 'bg-blue-100 text-blue-900 border-blue-200 shadow-sm'
                        : tag === '海淀区' 
                        ? 'bg-amber-100 text-amber-900 border-amber-200' 
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 font-medium italic">
                💡 来自食堂小道消息：{result.food.phdNote}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleCopyCard}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 active:scale-95"
              >
                {copied ? '✓ 已复制签卡' : '📋 复制签文'}
              </button>
              <button 
                onClick={onClose}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-200 transition-all active:scale-95"
              >
                领旨谢恩
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive AI PhD Mentor Chat */}
        {activeTab === 'chat' && (
          <div className="p-4 flex-1 flex flex-col min-h-[320px] max-h-[420px] bg-slate-50">
            <div className="flex-1 overflow-y-auto space-y-3 p-2">
              {chatHistory.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-red-600 text-white rounded-br-none font-medium' 
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none font-normal'
                    }`}
                  >
                    {msg.role === 'model' && (
                      <div className="text-[9px] font-bold text-red-600 mb-1 flex items-center gap-1">
                        <span>🎓 博导 AI 智能解签人</span>
                      </div>
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}
              {asking && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-bl-none text-xs text-slate-400 border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    <span>AI 导师正在推算易理...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Question Input Form */}
            <form onSubmit={handleAsk} className="mt-2 flex gap-2 pt-2 border-t border-slate-200">
              <input
                type="text"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="例如：论文被审稿人拒了怎么办？"
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                disabled={asking || !question.trim()}
                className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl disabled:bg-slate-300 hover:bg-red-700 transition-all shrink-0"
              >
                请教
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default ResultModal;
