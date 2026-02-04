import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, AlertTriangle, CheckCircle } from 'lucide-react';

interface StatsCardProps {
  buildingCount: number;
  damagePercentage: number;
  status: 'safe' | 'damaged' | 'critical';
}

export default function StatsCard({ buildingCount, damagePercentage, status }: StatsCardProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'safe':
        return {
          color: 'from-green-400 to-emerald-500',
          icon: CheckCircle,
          text: 'Structural Integrity Maintained'
        };
      case 'damaged':
        return {
          color: 'from-yellow-400 to-orange-500',
          icon: AlertTriangle,
          text: 'Structural Damage Detected'
        };
      case 'critical':
        return {
          color: 'from-red-400 to-pink-500',
          icon: AlertTriangle,
          text: 'Critical Structural Failure'
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <Card className="relative overflow-hidden group hover:scale-105 transition-transform duration-300">
      {/* Animated Gradient Border */}
      <div className={`absolute inset-0 bg-gradient-to-r ${config.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      <div className={`absolute inset-1 bg-gradient-to-r ${config.color} opacity-0 group-hover:opacity-50 blur-xl transition-all duration-300 group-hover:scale-110`}></div>
      
      <CardContent className="relative p-6 bg-slate-900/95 border border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${config.color} bg-opacity-20 border border-slate-700`}>
              <Building className="w-6 h-6 text-slate-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Building Status</h3>
              <p className="text-sm text-slate-400">Real-time structural analysis</p>
            </div>
          </div>
          <Badge variant="outline" className={`border-slate-600 text-slate-300 bg-gradient-to-r ${config.color} bg-opacity-10`}>
            <IconComponent className="w-4 h-4 mr-2" />
            {config.text}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="text-2xl font-bold text-white">{buildingCount}</div>
            <div className="text-xs text-slate-400">Buildings Monitored</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className={`text-2xl font-bold ${status === 'safe' ? 'text-green-400' : status === 'damaged' ? 'text-yellow-400' : 'text-red-400'}`}>
              {damagePercentage}%
            </div>
            <div className="text-xs text-slate-400">Damage Assessment</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-400">
            <span>Structural Integrity</span>
            <span>{100 - damagePercentage}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${config.color}`}
              style={{ width: `${100 - damagePercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-4 flex items-center justify-center space-x-2">
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${config.color} animate-pulse`}></div>
          <span className="text-sm text-slate-300 capitalize">{status} status</span>
        </div>
      </CardContent>
    </Card>
  );
}