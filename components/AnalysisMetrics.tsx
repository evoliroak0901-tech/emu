import React, { useEffect, useState, useRef } from 'react';

interface AnalysisMetricsProps {
  isAnalyzing: boolean;
  seedValue?: number;
}

class SeededRNG {
  private seed: number;
  constructor(seed: number) { this.seed = seed; }
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

const AnalysisMetrics: React.FC<AnalysisMetricsProps> = ({ isAnalyzing, seedValue = 12345 }) => {
  const [bars, setBars] = useState<number[]>(Array(12).fill(20));
  const rngRef = useRef<SeededRNG>(new SeededRNG(seedValue));

  useEffect(() => {
    rngRef.current = new SeededRNG(seedValue);
    setBars(Array(12).fill(10));
  }, [seedValue]);

  useEffect(() => {
    if (!isAnalyzing) return;

    const interval = setInterval(() => {
      const rng = rngRef.current;
      setBars(Array.from({ length: 12 }, () => Math.floor(rng.next() * 80) + 10));
    }, 120); // Slower, more elegant updates

    return () => clearInterval(interval);
  }, [isAnalyzing, seedValue]);

  return (
    <div className="w-full flex items-center justify-between px-2">
      <div className="flex items-center gap-4">
          <div className="flex items-end gap-1 h-8">
            {bars.map((height, i) => (
                <div 
                    key={i} 
                    className="w-1 bg-zinc-900/80 rounded-full transition-all duration-300 ease-out"
                    style={{ 
                        height: `${isAnalyzing ? height : 15}%`,
                        opacity: isAnalyzing ? 1 : 0.2
                    }}
                />
            ))}
          </div>
          <div className="flex flex-col">
              <span className="text-[10px] font-bold text-zinc-900 tracking-widest uppercase">
                  {isAnalyzing ? 'Extracting' : 'Resonance'}
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">
                  {isAnalyzing ? 'Calculating harmonics...' : 'Ready'}
              </span>
          </div>
      </div>
      
      <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-blue-500 animate-pulse' : 'bg-zinc-200'}`} />
    </div>
  );
};

export default AnalysisMetrics;