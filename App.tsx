import React, { useState, useEffect, useMemo } from 'react';
import { Plus, XCircle, Settings } from 'lucide-react';
import UploadZone from './components/UploadZone';
import GridOverlay from './components/GridOverlay';
import ResultCard from './components/ResultCard';
import AnalysisMetrics from './components/AnalysisMetrics';
import SettingsModal from './components/SettingsModal';
import { generateSunoPrompt } from './services/geminiService';
import { AppState, AnalysisResult } from './types';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // User API Key State
  const [userApiKey, setUserApiKey] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load key from storage on mount & check for missing keys
  useEffect(() => {
    const storedKey = localStorage.getItem('絵Mu_api_key');
    if (storedKey) {
        setUserApiKey(storedKey);
    } else {
        // If no local key AND no environment key, prompt user to get one
        // We use a slight delay to let the UI settle/animate in first
        if (!process.env.API_KEY) {
            const timer = setTimeout(() => setIsSettingsOpen(true), 1200);
            return () => clearTimeout(timer);
        }
    }
  }, []);

  const handleSaveKey = (key: string) => {
      setUserApiKey(key);
      localStorage.setItem('絵Mu_api_key', key);
      setIsSettingsOpen(false);
      // If we were in an error state due to missing key, reset to IDLE
      if (state === AppState.ERROR && error?.includes('Key')) {
          setState(AppState.IDLE);
          setError(null);
      }
  };

  const fileSeed = useMemo(() => {
    if (!file) return 12345;
    const str = file.name + file.size + file.type;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Scroll to result on success
  useEffect(() => {
    if (state === AppState.SUCCESS) {
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
    }
  }, [state]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setState(AppState.IDLE);
    setResult(null);
    setError(null);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    handleAnalyze(selectedFile);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error("Image processing failed"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyze = async (fileToAnalyze: File) => {
    try {
      setState(AppState.ANALYZING);
      setError(null);

      const minAnimationTime = 3000;
      const startTime = Date.now();

      const base64 = await fileToBase64(fileToAnalyze);
      // Pass the userApiKey to the service
      const analysisResult = await generateSunoPrompt(base64, userApiKey);
      
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minAnimationTime - elapsedTime);

      await new Promise(resolve => setTimeout(resolve, remainingTime));
      
      setResult(analysisResult);
      setState(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setState(AppState.ERROR);
      let msg = err.message || "An unexpected error occurred.";
      
      if (msg.toLowerCase().includes('permission') || msg.includes('403')) {
          msg = "Access denied. Check your API Key settings.";
      } else if (msg.includes('Key')) {
          msg = "API Key is missing. Please configure it in Settings.";
          // Auto-open settings if key is missing/invalid
          setTimeout(() => setIsSettingsOpen(true), 1500);
      }
      setError(msg);
    }
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setState(AppState.IDLE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans relative pb-24 md:pb-0 touch-pan-y">
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onSave={handleSaveKey}
        currentKey={userApiKey}
      />

      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-white">
        <div className="ambient-orb w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-blue-100/60 top-[-50px] left-[-50px]" style={{ animationDelay: '0s' }} />
        <div className="ambient-orb w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-purple-100/50 bottom-[-50px] right-[-50px]" style={{ animationDelay: '-5s' }} />
      </div>

      {/* Header */}
      <header className="w-full fixed top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 transition-all duration-300 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-4xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 select-none">
            <h1 className="text-xl md:text-2xl font-bold tracking-tighter text-zinc-900">
              絵<span className="font-light text-zinc-400">Mu</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             {/* Settings Gear */}
             <button 
                onClick={() => setIsSettingsOpen(true)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all active:scale-95"
             >
                <Settings className="w-5 h-5" />
             </button>

            {/* Desktop Reset Button */}
            {state === AppState.SUCCESS && (
                <button 
                onClick={reset} 
                className="hidden md:flex group items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-all duration-300 shadow-lg"
                >
                <Plus className="w-4 h-4" />
                <span>New Inspiration</span>
                </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-6 pt-24 md:pt-32 flex flex-col gap-8 md:gap-12">
        
        {/* Mobile Hero */}
        <div className={`transition-all duration-700 ease-in-out ${state === AppState.IDLE ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 hidden'}`}>
          <h2 className="text-4xl md:text-6xl font-bold text-center tracking-tighter text-zinc-900 mb-4 md:mb-6 leading-[1.1]">
            See the music.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Hear the image.
            </span>
          </h2>
          <p className="text-center text-zinc-500 text-sm md:text-base max-w-xs md:max-w-lg mx-auto leading-relaxed font-light">
            Capture a moment. Extract its emotional frequency.
          </p>
        </div>

        {/* Content Stacking */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start justify-center relative w-full">
            
            {/* Image Card */}
            <div className={`w-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${state === AppState.SUCCESS ? 'md:w-[380px]' : 'md:w-[420px] mx-auto'}`}>
                
                <div className={`
                    relative group rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-white shadow-xl transition-all duration-700
                    ${state === AppState.ANALYZING ? 'shadow-blue-200/50 scale-[1.02] md:scale-105' : 'shadow-zinc-200/50'}
                    ${state === AppState.ERROR ? 'shadow-red-200/50' : ''}
                `}>
                    <div className="aspect-[4/5] relative bg-zinc-50">
                        {previewUrl && (
                            <img 
                                src={previewUrl} 
                                alt="Muse" 
                                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 
                                ${state === AppState.ANALYZING ? 'scale-110 blur-sm brightness-110' : 'scale-100'}
                                ${state === AppState.ERROR ? 'grayscale opacity-50' : ''}
                                `}
                            />
                        )}
                        
                        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${state === AppState.ANALYZING ? 'opacity-100' : 'opacity-0'}`}>
                            <GridOverlay isAnalyzing={state === AppState.ANALYZING} />
                        </div>
                        
                        <UploadZone 
                            onFileSelect={handleFileSelect} 
                            previewUrl={previewUrl} 
                            disabled={state === AppState.ANALYZING} 
                        />
                    </div>
                </div>

                <div className={`mt-6 md:mt-8 transition-all duration-700 delay-100 px-2 md:px-0 ${state === AppState.IDLE ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                     <AnalysisMetrics isAnalyzing={state === AppState.ANALYZING} seedValue={fileSeed} />
                </div>
            </div>

            {/* Result Card (Slides up on mobile) */}
            {state === AppState.SUCCESS && result && (
                <div className="w-full md:flex-1 md:pt-4 fade-enter-active">
                     <ResultCard result={result} />
                </div>
            )}
            
            {/* Error Card */}
            {state === AppState.ERROR && (
                <div className="w-full md:flex-1 md:pt-10 fade-enter-active">
                     <div className="bg-white/80 backdrop-blur-xl border border-red-100 rounded-2xl p-6 md:p-8 shadow-xl shadow-red-100/30 text-center mx-4 md:mx-0">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                             <XCircle className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <h3 className="text-base md:text-lg font-bold text-zinc-900 mb-2">Connection Interrupted</h3>
                        <p className="text-zinc-500 text-xs md:text-sm mb-6 leading-relaxed">
                            {error || "The muse could not be reached."}
                        </p>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={reset}
                                className="w-full py-3 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors"
                            >
                                Try Again
                            </button>
                            <button 
                                onClick={() => setIsSettingsOpen(true)}
                                className="w-full py-3 bg-white border border-zinc-200 text-zinc-700 rounded-xl text-sm font-medium hover:bg-zinc-50 transition-colors"
                            >
                                Check API Settings
                            </button>
                        </div>
                     </div>
                </div>
            )}
        </div>
      </main>

      {/* Mobile Floating Action Button for Reset (Only on Success) */}
      {state === AppState.SUCCESS && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 md:hidden z-50 animate-[slideUp_0.5s_ease-out]">
            <button 
                onClick={reset}
                className="flex items-center gap-2 bg-zinc-900 text-white px-8 py-4 rounded-full shadow-2xl shadow-zinc-900/40 active:scale-95 transition-transform"
            >
                <Plus className="w-5 h-5" />
                <span className="text-sm font-bold tracking-wide">NEW</span>
            </button>
          </div>
      )}
    </div>
  );
};

export default App;