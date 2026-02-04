'use client';

import SidebarNavigation from '@/components/SidebarNavigation';
import { useSeismosStore } from '@/lib/store';
import { BUILDING_METADATA } from '@/lib/simulator';
import TiltBuildingCard from '@/components/TiltBuildingCard';

export default function HasarPage() {
    const { buildingDamages, nodes } = useSeismosStore();

    const getDamageCategory = (score: number) => {
        if (score >= 90) return { label: 'Yıkık', color: 'bg-red-500', textColor: 'text-red-400' };
        if (score >= 70) return { label: 'Ağır Hasarlı', color: 'bg-orange-500', textColor: 'text-orange-400' };
        if (score >= 30) return { label: 'Hasarlı', color: 'bg-yellow-500', textColor: 'text-yellow-400' };
        return { label: 'Güvenli', color: 'bg-green-500', textColor: 'text-green-400' };
    };

    const buildings = Array.from(nodes.entries()).map(([id, node]) => {
        const damageObj = buildingDamages.get(id);
        const damage = damageObj ? damageObj.totalScore : 0;
        const meta = BUILDING_METADATA.get(id);
        return { id, node, damage, meta, category: getDamageCategory(damage) };
    }).sort((a, b) => b.damage - a.damage);

    const stats = {
        total: buildings.length,
        safe: buildings.filter(b => b.damage < 30).length,
        damaged: buildings.filter(b => b.damage >= 30 && b.damage < 70).length,
        heavy: buildings.filter(b => b.damage >= 70 && b.damage < 90).length,
        collapsed: buildings.filter(b => b.damage >= 90).length,
    };

    return (
        <div className="h-screen bg-slate-950 overflow-hidden flex">
            <SidebarNavigation />
            <div className="flex-1 h-screen overflow-hidden flex flex-col">
                <div className="h-12 bg-slate-900/80 border-b border-slate-800 flex items-center px-6">
                    <h1 className="text-white font-semibold">Hasar Değerlendirme Raporu</h1>
                </div>

                <div className="flex-1 overflow-auto p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                            <div className="text-3xl font-bold text-white">{stats.total}</div>
                            <div className="text-sm text-slate-400">Toplam Bina</div>
                        </div>
                        <div className="bg-slate-900 border border-green-900 rounded-xl p-4">
                            <div className="text-3xl font-bold text-green-400">{stats.safe}</div>
                            <div className="text-sm text-slate-400">Güvenli</div>
                        </div>
                        <div className="bg-slate-900 border border-yellow-900 rounded-xl p-4">
                            <div className="text-3xl font-bold text-yellow-400">{stats.damaged}</div>
                            <div className="text-sm text-slate-400">Hasarlı</div>
                        </div>
                        <div className="bg-slate-900 border border-orange-900 rounded-xl p-4">
                            <div className="text-3xl font-bold text-orange-400">{stats.heavy}</div>
                            <div className="text-sm text-slate-400">Ağır Hasarlı</div>
                        </div>
                        <div className="bg-slate-900 border border-red-900 rounded-xl p-4">
                            <div className="text-3xl font-bold text-red-400">{stats.collapsed}</div>
                            <div className="text-sm text-slate-400">Yıkık</div>
                        </div>
                    </div>

                    {/* 3D Tilt Cards Grid */}
                    {/* 3D Tilt Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {buildings.slice(0, 4).map((b) => (
                            <TiltBuildingCard
                                key={b.id}
                                buildingId={b.id}
                                score={Math.round(b.damage > 0 ? 100 - b.damage : 100)} // Hasar yerine Sağlamlık Skoru
                                type={b.meta?.structureType || 'Bilinmiyor'}
                                yearBuilt={b.meta?.yearBuilt || 2000}
                                onClick={() => {
                                    useSeismosStore.getState().selectNode(b.id);
                                    window.location.href = '/?nodeId=' + b.id; // Basit navigasyon, idealde router.push
                                }}
                            />
                        ))}
                    </div>

                    {/* Building Table */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-800">
                            <h2 className="text-white font-semibold">Bina Listesi (Hasar Skoruna Göre)</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-800/50">
                                    <tr>
                                        <th className="text-left text-xs text-slate-400 px-4 py-3">Bina ID</th>
                                        <th className="text-left text-xs text-slate-400 px-4 py-3">Yapı Tipi</th>
                                        <th className="text-left text-xs text-slate-400 px-4 py-3">Kat Sayısı</th>
                                        <th className="text-left text-xs text-slate-400 px-4 py-3">Yapım Yılı</th>
                                        <th className="text-left text-xs text-slate-400 px-4 py-3">Hasar Skoru</th>
                                        <th className="text-left text-xs text-slate-400 px-4 py-3">Durum</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {buildings.slice(0, 20).map((b) => (
                                        <tr key={b.id} className="hover:bg-slate-800/30">
                                            <td className="px-4 py-3 text-sm text-white">{b.id}</td>
                                            <td className="px-4 py-3 text-sm text-slate-300">{b.meta?.structureType || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-slate-300">{b.meta?.floors || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-slate-300">{b.meta?.yearBuilt || '-'}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 bg-slate-700 rounded-full h-2">
                                                        <div className={`h-2 rounded-full ${b.category.color}`} style={{ width: `${b.damage}%` }}></div>
                                                    </div>
                                                    <span className="text-sm text-white">{b.damage.toFixed(0)}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs font-medium ${b.category.textColor}`}>{b.category.label}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
