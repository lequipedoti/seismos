import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface EmergencyAlertBannerProps {
  message: string;
  severity: 'critical' | 'warning' | 'info';
  onDismiss?: () => void;
  actionText?: string;
  onAction?: () => void;
}

export default function EmergencyAlertBanner({ 
  message, 
  severity, 
  onDismiss, 
  actionText, 
  onAction 
}: EmergencyAlertBannerProps) {
  const getSeverityConfig = () => {
    switch (severity) {
      case 'critical':
        return {
          gradient: 'from-red-500 via-pink-500 to-red-600',
          borderColor: 'border-red-400',
          icon: '🚨',
          textColor: 'text-red-100'
        };
      case 'warning':
        return {
          gradient: 'from-yellow-500 via-orange-500 to-red-500',
          borderColor: 'border-yellow-400',
          icon: '⚠️',
          textColor: 'text-yellow-100'
        };
      case 'info':
        return {
          gradient: 'from-blue-500 via-cyan-500 to-blue-600',
          borderColor: 'border-blue-400',
          icon: '📢',
          textColor: 'text-blue-100'
        };
    }
  };

  const config = getSeverityConfig();

  return (
    <div className={`relative overflow-hidden border-t-2 ${config.borderColor} bg-gradient-to-r ${config.gradient} shadow-2xl`}>
      {/* Animated Pulsing Effect */}
      <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
      
      <div className="relative container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Content */}
          <div className="flex items-center space-x-4">
            <div className="text-2xl animate-bounce">{config.icon}</div>
            <div>
              <h3 className={`font-bold text-lg ${config.textColor} drop-shadow-lg`}>
                Emergency Alert
              </h3>
              <p className={`${config.textColor} opacity-90 text-sm font-medium`}>
                {message}
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {actionText && onAction && (
              <Button 
                variant="outline" 
                onClick={onAction}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 font-semibold shadow-lg"
              >
                {actionText}
              </Button>
            )}
            {onDismiss && (
              <Button 
                variant="ghost" 
                onClick={onDismiss}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 animate-ping"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full -ml-10 -mb-10 animate-pulse delay-500"></div>
      </div>

      {/* CSS-in-JS Styles for Animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
}