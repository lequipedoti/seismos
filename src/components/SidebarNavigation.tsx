'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  Map,
  Settings,
  Menu,
  X,
  Home,
  Shield,
  AlertTriangle,
  Database,
  Cpu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarNavigationProps {
  className?: string;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export default function SidebarNavigation({ className = '', onCollapsedChange }: SidebarNavigationProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapsedChange?.(newState);
  };

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
          className="bg-slate-900/90 backdrop-blur-md border-slate-700 text-white hover:bg-slate-800"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative top-0 left-0 h-full z-40 
          bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${className}
        `}
      >
        {/* Header */}
        <div className={`p-4 border-b border-slate-700/50 ${isCollapsed ? 'px-2' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-white">Seismos</h1>
                <p className="text-xs text-slate-400">Monitoring Network</p>
              </div>
            )}
          </div>
        </div>

        {/* Collapse Button (Desktop only) */}
        <button
          onClick={handleCollapse}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-slate-600 rounded-full items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-50"
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* Navigation */}
        <nav className={`p-3 space-y-1 ${isCollapsed ? 'px-2' : ''}`}>
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.enabled ? item.href : '#'}
                onClick={(e) => !item.enabled && e.preventDefault()}
                title={isCollapsed ? item.label : undefined}
                className={`
                  flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} 
                  px-3 py-2.5 rounded-lg transition-all duration-200 group
                  ${item.active
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30'
                    : item.enabled
                      ? 'hover:bg-slate-800 cursor-pointer'
                      : 'opacity-40 cursor-not-allowed'
                  }
                `}
              >
                <div className={`
                  p-2 rounded-lg transition-all duration-200 ${item.enabled ? 'group-hover:scale-105' : ''}
                  ${item.active
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                  }
                `}>
                  <Icon className="w-4 h-4" />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span className={`text-sm font-medium ${item.active ? 'text-white' : 'text-slate-300'}`}>
                      {item.label}
                    </span>
                    {!item.enabled && (
                      <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">Yakında</span>
                    )}
                  </div>
                )}
                {item.active && !isCollapsed && (
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </a>
            );
          })}
        </nav>

        {/* Status Indicators - Only show when not collapsed */}
        {!isCollapsed && (
          <div className="absolute bottom-4 left-3 right-3 space-y-2">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-400">System Online</span>
              </div>
              <span className="text-xs text-slate-500">1000+ Nodes</span>
            </div>
          </div>
        )}

        {/* Collapsed Status Indicator */}
        {isCollapsed && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" title="System Online"></div>
          </div>
        )}
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}