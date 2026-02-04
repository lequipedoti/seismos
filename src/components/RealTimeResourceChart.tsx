import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { motion } from 'framer-motion';

interface DataPoint {
  time: string;
  value: number;
}

interface RealTimeResourceChartProps {
  title: string;
  subtitle?: string;
  dataKey: string;
  color?: 'cyan' | 'blue' | 'green' | 'purple';
  maxValue?: number;
  updateInterval?: number;
  showLiveIndicator?: boolean;
  value?: number;
}

export default function RealTimeResourceChart({
  title,
  subtitle,
  dataKey = 'value',
  color = 'cyan',
  maxValue = 100,
  updateInterval = 2000,
  showLiveIndicator = true,
  value
}: RealTimeResourceChartProps) {
  const [data, setData] = useState<DataPoint[]>([]);

  // Generate initial data
  useEffect(() => {
    const initialData: DataPoint[] = [];
    const now = new Date();

    for (let i = 59; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 1000);
      const timeString = time.toLocaleTimeString('tr-TR', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      initialData.push({
        time: timeString,
        value: 0
      });
    }

    setData(initialData);
  }, []);

  // Update data with new prop value
  useEffect(() => {
    if (value === undefined) return;

    setData(prevData => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('tr-TR', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const newData = [...prevData.slice(1), {
        time: timeString,
        value: Math.round(value)
      }];

      return newData;
    });
  }, [value]);

  // Get color configuration
  const getColorConfig = () => {
    switch (color) {
      case 'blue':
        return {
          gradient: 'url(#blueGradient)',
          stroke: '#3b82f6',
          fill: 'url(#blueGradient)',
          liveDot: '#60a5fa'
        };
      case 'green':
        return {
          gradient: 'url(#greenGradient)',
          stroke: '#10b981',
          fill: 'url(#greenGradient)',
          liveDot: '#34d399'
        };
      case 'purple':
        return {
          gradient: 'url(#purpleGradient)',
          stroke: '#8b5cf6',
          fill: 'url(#purpleGradient)',
          liveDot: '#a78bfa'
        };
      default: // cyan
        return {
          gradient: 'url(#cyanGradient)',
          stroke: '#06b6d4',
          fill: 'url(#cyanGradient)',
          liveDot: '#22d3ee'
        };
    }
  };

  const config = getColorConfig();

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-slate-900/95 border border-slate-700 rounded-lg p-3 shadow-xl backdrop-blur-sm">
          <p className="text-slate-300 text-xs mb-1">{label}</p>
          <p className="text-white font-semibold text-sm">
            {value.toFixed(0)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Get current value for live indicator
  const currentValue = data[data.length - 1]?.value || 0;

  return (
    <motion.div
      className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-xl backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-lg">{title}</h3>
          {subtitle && (
            <p className="text-slate-400 text-sm">{subtitle}</p>
          )}
        </div>

        {/* Live Indicator */}
        {showLiveIndicator && (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-200"></div>
              </div>
              <span className="text-xs text-slate-400 font-medium">Canlı</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Anlık</div>
              <div className="text-white font-bold text-sm">{currentValue}%</div>
            </div>
          </div>
        )}
      </div>

      {/* Chart Container */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            {/* Gradients */}
            <defs>
              <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#1e40af" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#065f46" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#4c1d95" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />

            <XAxis
              dataKey="time"
              hide={true}
            />

            <YAxis
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={[0, maxValue]}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="value"
              stroke={config.stroke}
              strokeWidth={3}
              fillOpacity={1}
              fill={config.fill}
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}