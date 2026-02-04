'use client';

import SidebarNavigation from '@/components/SidebarNavigation';
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function UyarilarPage() {
    const alerts = [
        {
            id: 1,
            type: 'critical',
            title: 'Kritik Hasar Tespit Edildi',
            message: 'SEN-023 kodlu binada yapısal bütünlük kaybı tespit edildi. Acil tahliye önerilir.',
            time: '2 dakika önce',
            building: 'Bina 23',
            icon: XCircle,
            color: 'red'
        },
        {
            id: 2,
            type: 'warning',
            title: 'Sismik Aktivite Artışı',
            message: 'Son 1 saatte bölgede mikro-deprem aktivitesi %15 arttı.',
            time: '15 dakika önce',
            building: 'Tüm Bölge',
            icon: AlertTriangle,
            color: 'yellow'
        },
        {
            id: 3,
            type: 'info',
            title: 'Sensör Bakımı Tamamlandı',
            message: 'SEN-045 ve SEN-046 sensörlerinin rutin bakımı başarıyla tamamlandı.',
            time: '1 saat önce',
            building: 'Bina 45, 46',
            icon: CheckCircle,
            color: 'green'
        },
        {
            id: 4,
            type: 'warning',
            title: 'Frekans Anomalisi',
            message: 'SEN-012 binasında doğal frekans kayması tespit edildi. İnceleme önerilir.',
            time: '3 saat önce',
            building: 'Bina 12',
            icon: AlertTriangle,
            color: 'yellow'
        },
        {
            id: 5,
            type: 'info',
            title: 'Sistem Güncellemesi',
            message: 'AI modeli v2.3.1 sürümüne güncellendi. Gürültü filtreleme iyileştirildi.',
            time: '6 saat önce',
            building: 'Sistem',
            icon: Clock,
            color: 'blue'
        }
    ];

    const getColorClasses = (color: string) => ({
        red: { bg: 'bg-red-500/10', border: 'border-red-500/30', icon: 'text-red-400' },
        yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: 'text-yellow-400' },
        green: { bg: 'bg-green-500/10', border: 'border-green-500/30', icon: 'text-green-400' },
        blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: 'text-blue-400' },
    }[color] || { bg: 'bg-slate-500/10', border: 'border-slate-500/30', icon: 'text-slate-400' });

    return (
        <div className="h-screen bg-slate-950 overflow-hidden flex">
            <SidebarNavigation />
            <div className="flex-1 h-screen overflow-hidden flex flex-col">
                <div className="h-12 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between px-6">
                    <h1 className="text-white font-semibold">Acil Durum Uyarıları</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-400">5 aktif uyarı</span>
                        <button className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                            Tümünü Okundu İşaretle
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-6">
                    <div className="space-y-3 max-w-4xl">
                        {alerts.map((alert) => {
                            const colors = getColorClasses(alert.color);
                            const Icon = alert.icon;
                            return (
                                <div
                                    key={alert.id}
                                    className={`${colors.bg} ${colors.border} border rounded-xl p-4 hover:scale-[1.01] transition-transform cursor-pointer`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-2 rounded-lg ${colors.bg}`}>
                                            <Icon className={`w-5 h-5 ${colors.icon}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="text-white font-medium">{alert.title}</h3>
                                                <span className="text-xs text-slate-500">{alert.time}</span>
                                            </div>
                                            <p className="text-sm text-slate-400 mb-2">{alert.message}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">{alert.building}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
