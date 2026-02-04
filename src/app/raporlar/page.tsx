'use client';

import SidebarNavigation from '@/components/SidebarNavigation';
import { FileText, Download, Calendar } from 'lucide-react';

export default function RaporlarPage() {
    const reports = [
        { id: 1, title: 'Haftalık Sismik Aktivite Raporu', date: '3 Şubat 2026', type: 'Haftalık', size: '2.4 MB' },
        { id: 2, title: 'Bina Hasar Değerlendirme Özeti', date: '1 Şubat 2026', type: 'Aylık', size: '5.1 MB' },
        { id: 3, title: 'Sensör Performans Analizi', date: '28 Ocak 2026', type: 'Haftalık', size: '1.8 MB' },
        { id: 4, title: 'AI Model Doğrulama Raporu', date: '25 Ocak 2026', type: 'Özel', size: '3.2 MB' },
        { id: 5, title: 'Ocak 2026 Aylık Özet', date: '1 Ocak 2026', type: 'Aylık', size: '8.7 MB' },
        { id: 6, title: 'Yıllık Deprem Risk Haritası 2025', date: '31 Aralık 2025', type: 'Yıllık', size: '15.4 MB' },
    ];

    return (
        <div className="h-screen bg-slate-950 overflow-hidden flex">
            <SidebarNavigation />
            <div className="flex-1 h-screen overflow-hidden flex flex-col">
                <div className="h-12 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between px-6">
                    <h1 className="text-white font-semibold">Veri Raporları</h1>
                    <button className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                        <FileText className="w-3 h-3" />
                        Yeni Rapor Oluştur
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {reports.map((report) => (
                            <div
                                key={report.id}
                                className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors group"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <FileText className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">{report.type}</span>
                                </div>
                                <h3 className="text-white font-medium mb-2">{report.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                                    <Calendar className="w-3 h-3" />
                                    {report.date}
                                    <span className="ml-auto">{report.size}</span>
                                </div>
                                <button className="w-full text-xs bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                    <Download className="w-3 h-3" />
                                    İndir
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
