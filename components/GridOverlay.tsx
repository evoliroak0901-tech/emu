import React from 'react';

interface GridOverlayProps {
  isAnalyzing: boolean;
}

const GridOverlay: React.FC<GridOverlayProps> = ({ isAnalyzing }) => {
  if (!isAnalyzing) return null;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {/* Soft overlay to focus attention */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] transition-all duration-1000" />
      
      {/* The Optical Scan Line */}
      <div className="absolute w-full h-[300%] top-[-100%] bg-gradient-to-b from-transparent via-white/40 to-transparent animate-[shimmer_3s_ease-in-out_infinite] transform rotate-12 blur-xl" />
      
      {/* Subtle pulsing glow from center */}
      <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-white/30 rounded-full blur-2xl animate-[pulse-soft_2s_ease-in-out_infinite]" />
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateY(0) rotate(12deg); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(50%) rotate(12deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default GridOverlay;