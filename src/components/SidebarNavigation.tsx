import { useState } from 'react';
import {
  LayoutDashboard,
  Map,
  FileText,
  Settings,
  Menu,
  X,
  Home,
  Shield,
  AlertTriangle,
  Database,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarNavigationProps {
  className?: string;
}

export default function SidebarNavigation({ className = '' }: SidebarNavigationProps) {
  const [isOpen, setIsOpen] = useState(true);

  const navigationItems = [
    {
      icon: Home,
      label: 'Dashboard',
      href: '/',
      active: true,
      enabled: true
    },
    {
      icon: Map,
      label: 'Seismic Map',
      href: '#',
      active: false,
      enabled: false
    },
    {
      icon: Shield,
      label: 'Damage Assessment',
      href: '#',
      active: false,
      enabled: false
    },
    {
      icon: AlertTriangle,
      label: 'Emergency Alerts',
      href: '#',
      active: false,
      enabled: false
    },
    {
      icon: Database,
      label: 'Data Reports',
      href: '#',
      active: false,
      enabled: false
    },
    {
      icon: Cpu,
      label: 'System Analytics',
      href: '#',
      active: false,
      enabled: false
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '#',
      active: false,
      enabled: false
    }
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative top-0 left-0 h-full w-64 lg:w-72 xl:w-80 bg-white/5 backdrop-blur-xl 
          border-r border-white/10 shadow-2xl lg:shadow-none z-40 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${className}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Seismos</h1>
              <p className="text-xs text-slate-300">Monitoring Network</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.enabled ? item.href : '#'}
                onClick={(e) => !item.enabled && e.preventDefault()}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${item.active
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20 shadow-lg'
                    : item.enabled
                      ? 'hover:bg-white/10 hover:border-white/20 cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                  }
                `}
              >
                <div className={`
                  p-2 rounded-lg transition-all duration-200 ${item.enabled ? 'group-hover:scale-110' : ''}
                  ${item.active
                    ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-lg'
                    : 'bg-white/10 text-slate-300 group-hover:bg-white/20'
                  }
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className={`font-medium ${item.active ? 'text-white' : 'text-slate-300'}`}>
                    {item.label}
                  </span>
                  {!item.enabled && (
                    <span className="ml-2 text-[10px] text-slate-500">(Yakında)</span>
                  )}
                </div>
                {item.active && (
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
                )}
              </a>
            );
          })}
        </nav>

        {/* Status Indicators */}
        <div className="absolute bottom-6 left-6 right-6 space-y-3">
          <div className="flex items-center justify-between px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-300">System Online</span>
            </div>
            <span className="text-xs text-slate-400">1000+ Nodes</span>
          </div>

          <div className="flex items-center justify-between px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-300">Real-time Data</span>
            </div>
            <span className="text-xs text-slate-400">Live</span>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-0 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-0 w-24 h-24 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-xl"></div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}