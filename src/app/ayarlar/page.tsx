'use client';

import SidebarNavigation from '@/components/SidebarNavigation';
import { Bell, Shield, Database, Palette, Globe, User } from 'lucide-react';
import { useState } from 'react';

export default function AyarlarPage() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);

    return (
        <div className="h-screen bg-slate-950 overflow-hidden flex">
            <SidebarNavigation />
            <div className="flex-1 h-screen overflow-hidden flex flex-col">
                <div className="h-12 bg-slate-900/80 border-b border-slate-800 flex items-center px-6">
                    <h1 className="text-white font-semibold">Ayarlar</h1>
                </div>

                <div className="flex-1 overflow-auto p-6">
                    <div className="max-w-2xl space-y-6">
                        {/* Profile Section */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">Sistem Yöneticisi</h3>
                                    <p className="text-sm text-slate-400">admin@seismos.gov.tr</p>
                                </div>
                            </div>
                        </div>

                        {/* Notification Settings */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-4">
                                <Bell className="w-5 h-5 text-blue-400" />
                                <h3 className="text-white font-semibold">Bildirim Ayarları</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <div className="text-sm text-white">Acil Durum Bildirimleri</div>
                                        <div className="text-xs text-slate-500">Kritik uyarılar için anında bildirim</div>
                                    </div>
                                    <button
                                        onClick={() => setNotifications(!notifications)}
                                        className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-blue-500' : 'bg-slate-700'}`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Display Settings */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-4">
                                <Palette className="w-5 h-5 text-purple-400" />
                                <h3 className="text-white font-semibold">Görünüm</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <div className="text-sm text-white">Karanlık Mod</div>
                                        <div className="text-xs text-slate-500">Göz yorgunluğunu azaltır</div>
                                    </div>
                                    <button
                                        onClick={() => setDarkMode(!darkMode)}
                                        className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-blue-500' : 'bg-slate-700'}`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                                    </button>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <div className="text-sm text-white">Otomatik Yenileme</div>
                                        <div className="text-xs text-slate-500">Verileri her 5 saniyede güncelle</div>
                                    </div>
                                    <button
                                        onClick={() => setAutoRefresh(!autoRefresh)}
                                        className={`w-12 h-6 rounded-full transition-colors ${autoRefresh ? 'bg-blue-500' : 'bg-slate-700'}`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${autoRefresh ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* System Info */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-4">
                                <Globe className="w-5 h-5 text-green-400" />
                                <h3 className="text-white font-semibold">Sistem Bilgisi</h3>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Versiyon</span>
                                    <span className="text-white">Seismos v1.0.0</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">API Durumu</span>
                                    <span className="text-green-400">Çevrimiçi</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Son Güncelleme</span>
                                    <span className="text-white">4 Şubat 2026, 15:45</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
