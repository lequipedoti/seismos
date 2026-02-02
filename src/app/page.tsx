'use client';

import dynamic from 'next/dynamic';
import CommandCenter from '@/components/dashboard/CommandCenter';
import { useEffect } from 'react';
import { useSeismosStore } from '@/lib/store';
import { simulator, DEMO_NODES } from '@/lib/simulator';
import { signalProcessor } from '@/lib/signal-processor';

const SeismicMap = dynamic(() => import('@/components/map/SeismicMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400 text-sm">
      Harita yükleniyor...
    </div>
  ),
});

export default function Home() {
  const {
    setNodes,
    addReading,
    setProcessedResult,
    updatePipelineStage,
    updateSignalLoss,
    isSimulationMode
  } = useSeismosStore();

  // Initialize Simulator
  useEffect(() => {
    // Set initial nodes
    setNodes(DEMO_NODES as any);

    if (isSimulationMode) {
      simulator.start((reading) => {
        // 1. Ingest reading
        updatePipelineStage('raw', 'processing');
        addReading(reading);
        updatePipelineStage('raw', 'complete');

        // 2. Process reading
        updatePipelineStage('filter', 'processing');
        const result = signalProcessor.process(reading);

        // 3. Update store with results
        setProcessedResult(reading.node_id, result);

        // Update global stages
        updatePipelineStage('filter', result.stages.filter.complete ? 'complete' : 'processing');
        updatePipelineStage('correlate', result.stages.correlate.complete ? 'complete' : 'processing');
        updatePipelineStage('interpret', result.stages.interpret.complete ? 'complete' : 'processing');
      });
    } else {
      simulator.stop();
    }

    // Signal loss check interval
    const signalCheck = setInterval(updateSignalLoss, 1000);

    return () => {
      simulator.stop();
      clearInterval(signalCheck);
    };
  }, [isSimulationMode, setNodes, addReading, setProcessedResult, updatePipelineStage, updateSignalLoss]);

  return (
    <CommandCenter>
      <div className="w-full h-[calc(100vh-64px)] relative">
        <SeismicMap />
      </div>
    </CommandCenter>
  );
}

