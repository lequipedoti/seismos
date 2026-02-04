import { useState, useEffect } from 'react';

interface AnimatedProgressBarProps {
  percentage: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  striped?: boolean;
  background?: string;
}

export default function AnimatedProgressBar({ 
  percentage = 0,
  label,
  showPercentage = true,
  color = 'blue',
  size = 'md',
  animated = true,
  striped = true,
  background = 'bg-slate-700'
}: AnimatedProgressBarProps) {
  const [currentPercentage, setCurrentPercentage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    setCurrentPercentage(0);
    
    const timer = setTimeout(() => {
      setCurrentPercentage(percentage);
      setIsAnimating(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [percentage]);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-2';
      case 'md': return 'h-3';
      case 'lg': return 'h-4';
      default: return 'h-3';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'green': return 'from-green-400 to-emerald-500';
      case 'yellow': return 'from-yellow-400 to-orange-500';
      case 'red': return 'from-red-400 to-pink-500';
      case 'purple': return 'from-purple-400 to-violet-500';
      case 'cyan': return 'from-cyan-400 to-blue-500';
      default: return 'from-blue-400 to-cyan-500';
    }
  };

  const getPercentageColor = () => {
    switch (color) {
      case 'green': return 'text-green-400';
      case 'yellow': return 'text-yellow-400';
      case 'red': return 'text-red-400';
      case 'purple': return 'text-purple-400';
      case 'cyan': return 'text-cyan-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="space-y-2">
      {/* Label and Percentage */}
      {(label || showPercentage) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-sm font-medium text-slate-300">{label}</span>
          )}
          {showPercentage && (
            <span className={`text-sm font-bold ${getPercentageColor()}`}>
              {Math.round(currentPercentage)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Bar Container */}
      <div className={`w-full ${background} rounded-full overflow-hidden border border-slate-600`}>
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Progress Fill */}
        <div 
          className={`
            h-full bg-gradient-to-r ${getColorClasses()}
            transition-all duration-1000 ease-out
            ${striped ? 'bg-[length:20px_20px] bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.2),rgba(255,255,255,0.2)_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]' : ''}
            ${animated ? 'animate-shimmer' : ''}
            ${getSizeClasses()}
          `}
          style={{ 
            width: `${currentPercentage}%`,
            boxShadow: `0 0 15px rgba(56, 189, 248, ${currentPercentage > 50 ? 0.5 : 0.2})`
          }}
        >
          {/* Animated Shine Effect */}
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          )}
          
          {/* Inner Glow */}
          <div className="absolute inset-0 bg-white/10 rounded-full"></div>
        </div>
      </div>

      {/* Progress Details */}
      <div className="flex justify-between text-xs text-slate-400">
        <span>Progress</span>
        <span>{Math.round(currentPercentage)}/100%</span>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 bg-gradient-to-r ${getColorClasses()} rounded-full ${isAnimating ? 'animate-pulse' : ''}`}></div>
        <span className="text-xs text-slate-400">
          {isAnimating ? 'Updating...' : currentPercentage >= 100 ? 'Complete' : 'In Progress'}
        </span>
      </div>

      {/* CSS-in-JS Styles for Animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}