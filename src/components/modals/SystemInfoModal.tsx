import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import AnimatedBackground from '@/components/ui/animated-background';

interface SystemInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SystemInfoModal({ isOpen, onClose }: SystemInfoModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[85vh] w-[90vw] overflow-hidden flex flex-col bg-white p-0 gap-0">
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
                                <pre className="whitespace-pre-wrap font-inherit">
                                    <span className="text-gray-500">// INSD — KARAR MEKANİZMASI (DECISION LOGIC)</span>
                                    {'\n\n'}
                                    <span className="text-gray-500">// AŞAMA 1: OLAY KORELASYONU KONTROLÜ</span>{'\n'}
                                    <span className="text-purple-400">IF</span> (Detected_Events_By_Neighbors &ge; <span className="text-blue-400">N_MIN</span>){'\n'}
                                    <span className="text-purple-400">AND</span> (Event_Intensity &ge; <span className="text-blue-400">EVENT_THRESHOLD</span>){'\n'}
                                    <span className="text-purple-400">THEN</span>{'\n'}
                                    {'    '}Event_Correlation = <span className="text-yellow-400">TRUE</span>{'\n'}
                                    <span className="text-purple-400">ELSE</span>{'\n'}
                                    {'    '}Event_Correlation = <span className="text-yellow-400">FALSE</span>
                                    {'\n\n'}
                                    <span className="text-gray-500">// AŞAMA 2: SAĞLIK SİNYALİ SÜREKLİLİĞİ KONTROLÜ</span>{'\n'}
                                    <span className="text-purple-400">IF</span> (Heartbeat_Missing_Duration &ge; <span className="text-blue-400">HEARTBEAT_TIMEOUT</span>){'\n'}
                                    <span className="text-purple-400">THEN</span>{'\n'}
                                    {'    '}Heartbeat_Lost = <span className="text-yellow-400">TRUE</span>{'\n'}
                                    <span className="text-purple-400">ELSE</span>{'\n'}
                                    {'    '}Heartbeat_Lost = <span className="text-yellow-400">FALSE</span>
                                    {'\n\n'}
                                    <span className="text-gray-500">// AŞAMA 3: KOMŞU FİZİKSEL ANOMALİ TESPİTİ</span>{'\n'}
                                    <span className="text-purple-400">IF</span> (Neighbor_Vibration_Anomaly &ge; <span className="text-blue-400">ANOMALY_THRESHOLD</span>){'\n'}
                                    <span className="text-purple-400">OR</span> (Local_Stiffness_Shift_Detected == <span className="text-yellow-400">TRUE</span>){'\n'}
                                    <span className="text-purple-400">THEN</span>{'\n'}
                                    {'    '}Neighborhood_Anomaly = <span className="text-yellow-400">TRUE</span>{'\n'}
                                    <span className="text-purple-400">ELSE</span>{'\n'}
                                    {'    '}Neighborhood_Anomaly = <span className="text-yellow-400">FALSE</span>
                                    {'\n\n'}
                                    <span className="text-gray-500">// NİHAİ KARAR BİRLEŞTİRME</span>{'\n'}
                                    <span className="text-purple-400">IF</span> (Event_Correlation == <span className="text-yellow-400">TRUE</span>){'\n'}
                                    <span className="text-purple-400">AND</span> (Heartbeat_Lost == <span className="text-yellow-400">TRUE</span>){'\n'}
                                    <span className="text-purple-400">AND</span> (Neighborhood_Anomaly == <span className="text-yellow-400">TRUE</span>){'\n'}
                                    <span className="text-purple-400">THEN</span>{'\n'}
                                    {'    '}Target_Node_Status = <span className="text-white bg-purple-900/50 px-1 rounded">PROBABLE_COLLAPSE</span>   <span className="text-gray-500">// OLASI YIKIM</span>{'\n'}
                                    <span className="text-purple-400">ELSE IF</span> (Event_Correlation == <span className="text-yellow-400">TRUE</span>){'\n'}
                                    <span className="text-purple-400">AND</span> (Heartbeat_Lost == <span className="text-yellow-400">TRUE</span>){'\n'}
                                    <span className="text-purple-400">THEN</span>{'\n'}
                                    {'    '}Target_Node_Status = <span className="text-gray-300">SILENT_UNDER_REVIEW</span> <span className="text-gray-500">// SUSKUN – İNCELEMEDE</span>{'\n'}
                                    <span className="text-purple-400">ELSE</span>{'\n'}
                                    {'    '}Target_Node_Status = <span className="text-green-400">NO_CONFIRMED_FAILURE</span>
                                </pre>
                            </div>
                        </section >

    <Separator />

{/* Distributed Architecture */ }
<section className="space-y-3">
    <h3 className="font-bold text-gray-900">Bağlam Odaklı Merkez Destekli Dağıtık Mimari</h3>
    <p className="text-sm text-gray-600 leading-relaxed">
        SEISMOS, bina bazlı sensör node’larının bağımsız olarak çalıştığı ve verilerini yerel olarak ön işleyerek merkezi sisteme ilettiği dağıtık bir izleme mimarisi kullanır. Her node, yapının titreşim karakteristiğini temsil eden temel fiziksel parametreleri üretir ve düşük bant genişliğiyle paylaşır.
    </p>
    <p className="text-sm text-gray-600 leading-relaxed">
        Merkez destek katmanı, aynı bölgedeki binalardan gelen verileri zamansal ve mekânsal bağlam içinde değerlendirerek çok aşamalı doğrulama mekanizmasını uygular. Bu sayede tekil sensör hatalarına dayanıklı, ölçeklenebilir ve afet anlarında güvenilir yapı durumu farkındalığı sağlanır.
    </p>
</section>

                    </div >
                </div >

    <div className="p-6 pt-2 mt-auto border-t border-gray-100 flex justify-end bg-gray-50/50 shrink-0">
        <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 text-sm font-medium transition-colors"
        >
            Anlaşıldı
        </button>
    </div>
            </DialogContent >
        </Dialog >
    );
}
