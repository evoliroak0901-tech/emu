import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, ExternalLink } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentKey }) => {
  const [keyInput, setKeyInput] = useState(currentKey);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setKeyInput(currentKey);
        setIsVisible(true);
    } else {
        setIsVisible(false);
    }
  }, [isOpen, currentKey]);

  if (!isOpen && !isVisible) return null;

  return (
    <div 
        className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={`
        relative w-full max-w-sm bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 md:p-8 
        transform transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
        ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
      `}>
        
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                    <Key className="w-4 h-4 text-zinc-600" />
                </div>
                <h2 className="text-lg font-bold text-zinc-900">Access Key</h2>
            </div>
            <button 
                onClick={onClose} 
                className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center transition-colors"
            >
                <X className="w-5 h-5 text-zinc-400" />
            </button>
        </div>

        <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
            To use 絵Mu, please enter your personal Google Gemini API Key.
            <br />
            <span className="opacity-70 text-[10px]">Your key is stored securely in your browser's local storage.</span>
        </p>

        <div className="space-y-4">
            <div className="relative">
                <input
                    type="password"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="Paste AI Studio Key here..."
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                />
            </div>

            <button
                onClick={() => onSave(keyInput)}
                disabled={!keyInput.trim()}
                className="w-full py-3.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-zinc-900/10"
            >
                <ShieldCheck className="w-4 h-4" />
                <span>Save Credentials</span>
            </button>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-col gap-3">
            <span className="text-[10px] text-zinc-400 font-medium text-center uppercase tracking-wider">Don't have a key?</span>
             <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="w-full py-3 rounded-xl border border-blue-100 bg-blue-50/50 text-blue-600 text-xs font-bold hover:bg-blue-100 hover:border-blue-200 transition-all flex items-center justify-center gap-2 group"
             >
                <span>Get API Key from Google</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
             </a>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;