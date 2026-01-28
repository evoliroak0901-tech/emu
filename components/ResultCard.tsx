import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ResultCardProps {
  result: AnalysisResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full animate-[slideUp_0.8s_cubic-bezier(0.16,1,0.3,1)] pb-20 md:pb-0">
      
      {/* Title */}
      <div className="mb-4 md:mb-6 px-2 text-center md:text-left">
          <h3 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight">Sonic Identity</h3>
          <p className="text-xs md:text-sm text-zinc-400 font-light mt-1">Generated from visual harmonics</p>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 border border-white/50 shadow-xl shadow-zinc-200/50">
        
        {/* The Prompt (The Main Track) */}
        <div className="mb-6 md:mb-8">
            <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-3 block">
                Primary Composition Prompt
            </label>
            <div className="group relative bg-white/50 rounded-xl p-4 md:p-0 md:bg-transparent border border-white md:border-none">
                <div className="text-base md:text-xl font-medium text-zinc-800 leading-relaxed font-sans cursor-text selection:bg-blue-100 break-words">
                    {result.prompt}
                </div>
            </div>
            
            <button
                onClick={handleCopy}
                className={`
                    mt-4 md:mt-6 w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl md:rounded-full text-sm font-semibold transition-all duration-300
                    ${copied 
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                        : 'bg-zinc-900 text-white hover:bg-zinc-800 hover:shadow-xl active:scale-95'}
                `}
            >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy Prompt'}</span>
            </button>
        </div>

        <div className="border-t border-zinc-100 my-6 md:my-8" />

        {/* Insight Section (Liner Notes) */}
        <div className="space-y-6">
             <div>
                <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-2 block">
                    Interpretation
                </label>
                <p className="text-xs md:text-sm text-zinc-600 leading-6 md:leading-7 font-light">
                    {result.technical_summary}
                </p>
             </div>

             <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                {result.logs.slice(0, 4).map((log, index) => (
                    <div key={index} className="bg-white/50 rounded-lg md:rounded-xl p-3 md:p-4 border border-white/60">
                        <span className="text-[9px] md:text-[10px] text-zinc-400 block mb-1 uppercase tracking-wider">{log.parameter}</span>
                        <div className="text-xs font-semibold text-zinc-700">{log.musical_translation}</div>
                    </div>
                ))}
             </div>
        </div>
      </div>
      
      <style>{`
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ResultCard;