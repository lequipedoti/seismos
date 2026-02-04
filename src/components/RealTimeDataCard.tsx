import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';

interface RealTimeDataCardProps {
  title: string;
  currentValue: number;
  unit: string;
  dataPoints: number[];
  timeRange: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  trendPercentage: number;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export default function RealTimeDataCard({ 
  title, 
  currentValue, 
  unit, 
  dataPoints, 
  timeRange,
  trendDirection = 'neutral',
  trendPercentage,
  color = 'blue'
}: RealTimeDataCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [currentValue]);

  const getColorConfig = () => {
    switch (color) {
      case 'green': return { gradient: 'from-green-400 to-emerald-500', text: 'text-green-400', border: 'border-green-400/30' };
      case 'yellow': return { gradient: 'from-yellow-400 to-orange-500', text: 'text-yellow-400', border: 'border-yellow-400/30' };
      case 'red': return { gradient: 'from-red-400 to-pink-500', text: 'text-red-400', border: 'border-red-400/30' };
      case 'purple': return { gradient: 'from-purple-400 to-violet-500', text: 'text-purple-400', border: 'border-purple-400/30' };
      default: return { gradient: 'from-blue-400 to-cyan-500', text: 'text-blue-400', border: 'border-blue-400/30' };
    }
  };

  const config = getColorConfig();

  // Generate SVG path for sparkline
  const generateSparklinePath = (data: number[]) => {
    if (data.length < 2) return '';
    
    const width = 200;
    const height = 60;
    const padding = 10;
    const xStep = (width - padding * 2) / (data.length - 1);
    
    // Normalize data to fit within SVG bounds
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const range = maxValue - minValue || 1; // Avoid division by zero
    
    const points = data.map((value, index) => {
      const x = padding + (index * xStep);
      const y = height - padding - ((value - minValue) / range) * (height - padding * 2);
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'up': return <TrendingUp className={`w-4 h-4 ${config.text}`} />;
      case 'down': return <TrendingDown className={`w-4 h-4 ${config.text}`} />;
      default: return <Minus className={`w-4 h-4 ${config.text}`} />;
    }
  };

  const getTrendColor = () => {
    switch (trendDirection) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <Card className="relative overflow-hidden group hover:scale-105 transition-all duration-300">
      {/* Animated Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      <div className={`absolute inset-1 bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-all duration-300 group-hover:scale-110`}></div>
      
      <CardContent className="relative p-6 bg-slate-900/95 border border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-slate-400">{timeRange}</p>
          </div>
          <div className={`p-2 rounded-lg bg-gradient-to-r ${config.gradient} bg-opacity-20 border ${config.border}`}>
            {getTrendIcon()}
          </div>
        </div>

        {/* Current Value */}
        <div className="flex items-end justify-between mb-4">
          <div className={`text-3xl font-bold ${config.text} transition-all duration-500 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
            {currentValue.toLocaleString()}
            <span className="text-slate-400 text-lg ml-1">{unit}</span>
          </div>
          <div className={`flex items-center space-x-2 ${getTrendColor()}`}>
            <span className="text-sm font-medium">{Math.abs(trendPercentage)}%</span>
            {getTrendIcon()}
          </div>
        </div>

        {/* Sparkline Chart */}
        <div className="relative">
          <svg width="200" height="60" className="w-full">
            {/* Grid lines */}
            <defs>
              <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(56, 189, 248, 0.3)" />
                <stop offset="100%" stopColor="rgba(168, 85, 247, 0.1)" />
              </linearGradient>
            </defs>
            
            {/* Background grid */}
            <line x1="0" y1="20" x2="200" y2="20" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <line x1="0" y1="40" x2="200" y2="40" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <line x1="0" y1="60" x2="200" y2="60" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            
            {/* Sparkline line */}
            <path
              d={generateSparklinePath(dataPoints)}
              fill="none"
              stroke="url(#gradient-blue)"
              strokeWidth="2"
              className="transition-all duration-1000 ease-in-out"
            />
            
            {/* Fill area under line */}
            <path
              d={`${generateSparklinePath(dataPoints)} L 200,60 L 0,60 Z`}
              fill="url(#gradient-blue)"
              opacity="0.3"
              className="transition-all duration-1000 ease-in-out"
            />
            
            {/* Animated pulse on last point */}
            <circle
              cx={190}
              cy={dataPoints.length > 0 ? 60 - ((dataPoints[dataPoints.length - 1] - Math.min(...dataPoints)) / (Math.max(...dataPoints) - Math.min(...dataPoints)) || 0) * 40 : 30}
              r="3"
              fill="white"
              className="animate-pulse"
            />
          </svg>
          
          {/* Chart overlay for hover effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Data Range Info */}
        <div className="mt-4 flex justify-between text-xs text-slate-400">
          <span>Min: {Math.min(...dataPoints).toLocaleString()} {unit}</span>
          <span>Max: {Math.max(...dataPoints).toLocaleString()} {unit}</span>
        </div>

        {/* Live Indicator */}
        <div className="mt-3 flex items-center space-x-2">
          <div className={`w-2 h-2 bg-gradient-to-r ${config.gradient} rounded-full animate-pulse`}></div>
          <span className="text-xs text-slate-300">Live Data</span>
        </div>
      </CardContent>
    </Card>
  );
}