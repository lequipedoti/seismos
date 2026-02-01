import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { FlipCard } from '@/components/ui/flip-card';

interface SystemInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SystemInfoModal({ isOpen, onClose }: SystemInfoModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[85vh] w-[90vw] overflow-hidden flex flex-col bg-white p-0 gap-0">
                <div className="p-6 pb-2 shrink-0">
                    <DialogHeader className="p-0 space-y-2">
                        <DialogTitle className="text-xl font-mono font-bold flex items-center gap-2 text-gray-900">
                            <span className="w-6 h-6 rounded bg-cyan-600 flex items-center justify-center text-white text-xs">i</span>
                            SEISMOS Dağıtık Algılama ve Karar Destek Sistemi
                        </DialogTitle>
                    </DialogHeader>
                </div>

                <div className="px-6 shrink-0">
                    <Separator />
                </div>

                <div className="flex-1 overflow-y-auto p-6 min-h-0">
                    <div className="space-y-6">

                        {/* INSD Section */}
                        <section className="space-y-3">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                Implicit Node Silence Detection (INSD)
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Bir node'un susması, sistem tarafından doğrudan değil, çevresindeki fiziksel olayların korelasyonu üzerinden algılanır.
                                Sistem, "A binası sustu mu?" diye sormaz; bunun yerine <strong>olması gereken davranış</strong> ile <strong>olan davranış</strong> arasındaki farkı analiz eder.
                            </p>

                            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                                <FlipCard
                                    front={
                                        <div className="h-full w-full bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-center text-center shadow-sm">
                                            <div className="text-sm font-bold text-gray-900 uppercase tracking-tight">
                                                AŞAMA 1:<br />OLAY KORELASYONU
                                            </div>
                                        </div>
                                    }
                                    back={
                                        <div className="h-full w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-center shadow-sm">
                                            <p className="text-xs text-center text-gray-700 leading-relaxed font-medium">
                                                Aynı bölgede yer alan komşu binalar sismik bir olay raporlarken, hedef binadan eş zamanlı bir olay verisi gelmemesi durumu değerlendirilir.
                                            </p>
                                        </div>
                                    }
                                />

                                <FlipCard
                                    front={
                                        <div className="h-full w-full bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-center text-center shadow-sm">
                                            <div className="text-sm font-bold text-gray-900 uppercase tracking-tight">
                                                AŞAMA 2:<br />SAĞLIK SİNYALİ
                                            </div>
                                        </div>
                                    }
                                    back={
                                        <div className="h-full w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-center shadow-sm">
                                            <p className="text-xs text-center text-gray-700 leading-relaxed font-medium">
                                                Deprem sonrası belirlenen süre içinde node’un periyodik <span className="font-bold">"yaşıyorum"</span> (heartbeat) sinyalini gönderip göndermediği izlenir.
                                            </p>
                                        </div>
                                    }
                                />

                                <FlipCard
                                    front={
                                        <div className="h-full w-full bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-center text-center shadow-sm">
                                            <div className="text-sm font-bold text-gray-900 uppercase tracking-tight">
                                                AŞAMA 3:<br />KOMŞU ANOMALİSİ
                                            </div>
                                        </div>
                                    }
                                    back={
                                        <div className="h-full w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-center shadow-sm">
                                            <p className="text-xs text-center text-gray-700 leading-relaxed font-medium">
                                                Komşu binalarda, olası bir çökme sonucu oluşan ani yük boşalması ve zemin-gerilme değişimlerine bağlı titreşim anomalileri analiz edilir.
                                            </p>
                                        </div>
                                    }
                                />
                            </div>

                            <Separator className="my-3" />

                            {/* Distributed Architecture - MOVED HERE */}
                            <section className="space-y-2 mb-4">
                                <h3 className="font-bold text-gray-900">Bağlam Odaklı Merkez Destekli Dağıtık Mimari</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    SEISMOS, bina bazlı sensör node’larının bağımsız olarak çalıştığı ve verilerini yerel olarak ön işleyerek merkezi sisteme ilettiği dağıtık bir izleme mimarisi kullanır. Her node, yapının titreşim karakteristiğini temsil eden temel fiziksel parametreleri üretir ve düşük bant genişliğiyle paylaşır.
                                </p>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Merkez destek katmanı, aynı bölgedeki binalardan gelen verileri zamansal ve mekânsal bağlam içinde değerlendirerek çok aşamalı doğrulama mekanizmasını uygular. Bu sayede tekil sensör hatalarına dayanıklı, ölçeklenebilir ve afet anlarında güvenilir yapı durumu farkındalığı sağlanır.
                                </p>
                            </section>

                            <div className="bg-slate-900 text-gray-300 p-4 rounded-lg font-mono text-[10px] sm:text-xs overflow-x-auto shadow-inner leading-relaxed border border-slate-800">
                                <pre className="whitespace-pre-wrap font-inherit">
                                    <span className="text-slate-500">// INSD — KARAR MEKANİZMASI (DECISION LOGIC)</span>
                                    {'\n\n'}
                                    <span className="text-slate-500">// AŞAMA 1: OLAY KORELASYONU KONTROLÜ</span>{'\n'}
                                    <span className="text-purple-300">IF</span> (Detected_Events_By_Neighbors &ge; <span className="text-blue-300">N_MIN</span>){'\n'}
                                    <span className="text-purple-300">AND</span> (Event_Intensity &ge; <span className="text-blue-300">EVENT_THRESHOLD</span>){'\n'}
                                    <span className="text-purple-300">THEN</span>{'\n'}
                                    {'    '}Event_Correlation = <span className="text-yellow-200">TRUE</span>{'\n'}
                                    <span className="text-purple-300">ELSE</span>{'\n'}
                                    {'    '}Event_Correlation = <span className="text-yellow-200">FALSE</span>
                                    {'\n\n'}
                                    <span className="text-slate-500">// AŞAMA 2: SAĞLIK SİNYALİ SÜREKLİLİĞİ KONTROLÜ</span>{'\n'}
                                    <span className="text-purple-300">IF</span> (Heartbeat_Missing_Duration &ge; <span className="text-blue-300">HEARTBEAT_TIMEOUT</span>){'\n'}
                                    <span className="text-purple-300">THEN</span>{'\n'}
                                    {'    '}Heartbeat_Lost = <span className="text-yellow-200">TRUE</span>{'\n'}
                                    <span className="text-purple-300">ELSE</span>{'\n'}
                                    {'    '}Heartbeat_Lost = <span className="text-yellow-200">FALSE</span>
                                    {'\n\n'}
                                    <span className="text-slate-500">// AŞAMA 3: KOMŞU FİZİKSEL ANOMALİ TESPİTİ</span>{'\n'}
                                    <span className="text-purple-300">IF</span> (Neighbor_Vibration_Anomaly &ge; <span className="text-blue-300">ANOMALY_THRESHOLD</span>){'\n'}
                                    <span className="text-purple-300">OR</span> (Local_Stiffness_Shift_Detected == <span className="text-yellow-200">TRUE</span>){'\n'}
                                    <span className="text-purple-300">THEN</span>{'\n'}
                                    {'    '}Neighborhood_Anomaly = <span className="text-yellow-200">TRUE</span>{'\n'}
                                    <span className="text-purple-300">ELSE</span>{'\n'}
                                    {'    '}Neighborhood_Anomaly = <span className="text-yellow-200">FALSE</span>
                                    {'\n\n'}
                                    <span className="text-slate-500">// NİHAİ KARAR BİRLEŞTİRME</span>{'\n'}
                                    <span className="text-purple-300">IF</span> (Event_Correlation == <span className="text-yellow-200">TRUE</span>){'\n'}
                                    <span className="text-purple-300">AND</span> (Heartbeat_Lost == <span className="text-yellow-200">TRUE</span>){'\n'}
                                    <span className="text-purple-300">AND</span> (Neighborhood_Anomaly == <span className="text-yellow-200">TRUE</span>){'\n'}
                                    <span className="text-purple-300">THEN</span>{'\n'}
                                    {'    '}Target_Node_Status = <span className="text-white bg-purple-900/50 px-1 rounded">PROBABLE_COLLAPSE</span>   <span className="text-slate-400">// OLASI YIKIM</span>{'\n'}
                                    <span className="text-purple-300">ELSE IF</span> (Event_Correlation == <span className="text-yellow-200">TRUE</span>){'\n'}
                                    <span className="text-purple-300">AND</span> (Heartbeat_Lost == <span className="text-yellow-200">TRUE</span>){'\n'}
                                    <span className="text-purple-300">THEN</span>{'\n'}
                                    {'    '}Target_Node_Status = <span className="text-gray-300">SILENT_UNDER_REVIEW</span> <span className="text-slate-400">// SUSKUN – İNCELEMEDE</span>{'\n'}
                                    <span className="text-purple-300">ELSE</span>{'\n'}
                                    {'    '}Target_Node_Status = <span className="text-green-300">NO_CONFIRMED_FAILURE</span>
                                </pre>
                            </div>
                        </section>



                    </div>
                </div>

                <div className="p-6 pt-2 mt-auto border-t border-gray-100 flex justify-end bg-gray-50/50 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 text-sm font-medium transition-colors"
                    >
                        Anlaşıldı
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
