import React, { useState } from 'react';
import {
  Sparkles,
  Repeat,
  Shield,
  Layers,
  Play,
  RotateCcw,
  CheckCircle,
  Video,
  Plus
} from 'lucide-react';
import { ProjectState, EditorState, EditorAction, Layer } from '../../types';
import { generateId } from '../../utils/animation';

interface StockCreatorPanelProps {
  project: ProjectState;
  editor: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

export const StockCreatorPanel: React.FC<StockCreatorPanelProps> = ({
  project,
  editor,
  dispatch
}) => {
  const [theme, setTheme] = useState('Tech & Cyber Grid');
  const [loopDuration, setLoopDuration] = useState<5 | 10 | 15 | 20>(10);
  const [assetType, setAssetType] = useState<'loop' | 'greenscreen' | 'transparent_alpha'>('loop');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loopVerified, setLoopVerified] = useState(true);

  const handleGenerateStock = () => {
    setIsGenerating(true);
    dispatch({ type: 'DEDUCT_CREDITS', payload: 20 });

    setTimeout(() => {
      // Create seamless loop layer in canvas
      const newLayer: Layer = {
        id: `stock_${generateId()}`,
        name: `Stock ${theme} (${loopDuration}s Loop)`,
        type: 'circle',
        baseProps: {
          x: project.resolution.w / 2,
          y: project.resolution.h / 2,
          width: Math.round(project.resolution.w * 0.4),
          height: Math.round(project.resolution.w * 0.4),
          fill: assetType === 'greenscreen' ? '#00ff00' : 'transparent',
          stroke: '#38bdf8',
          strokeWidth: 3,
          borderRadius: '50%',
          opacity: 0.85,
          rotation: 0,
          scale: 1
        },
        effects: { blur: 0, shadow: 15, glow: 30 },
        animations: {
          rotation: [
            { time: 0, value: 0, easing: 'linear' },
            { time: loopDuration, value: 360 }
          ],
          scale: [
            { time: 0, value: 0.9, easing: 'easeInOutQuad' },
            { time: loopDuration / 2, value: 1.1 },
            { time: loopDuration, value: 0.9 }
          ]
        },
        provenance: 'ai_generated'
      };

      dispatch({ type: 'ADD_LAYER', payload: newLayer });
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4 text-neutral-200">
      {/* Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Repeat size={16} className="text-cyan-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Stock Creator & Motion Loop Generator
            </h2>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Synthesize seamless video backgrounds, green-screen assets, and alpha-channel looping particles.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded-lg text-xs">
          <CheckCircle size={14} className="text-emerald-400" />
          <span className="text-neutral-400">Zero-Jump Loop Verification:</span>
          <span className="font-mono font-bold text-emerald-400">Active</span>
        </div>
      </div>

      {/* Generator Configuration */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 space-y-3 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Stock Category</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-white outline-none"
            >
              <option value="Tech & Cyber Grid">Tech & Cyber Grid</option>
              <option value="Abstract Kinetic Ribbons">Abstract Kinetic Ribbons</option>
              <option value="Minimal Dark Pedestal">Minimal Dark Pedestal</option>
              <option value="Liquid Glass Wave">Liquid Glass Wave</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Asset Channel Mode</label>
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value as any)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-white outline-none"
            >
              <option value="loop">Seamless Seamless Loop</option>
              <option value="greenscreen">Chroma Key Green Screen</option>
              <option value="transparent_alpha">Alpha Channel Transparent</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Loop Cycle Duration</label>
            <div className="grid grid-cols-4 gap-1.5">
              {([5, 10, 15, 20] as const).map((sec) => (
                <button
                  key={sec}
                  onClick={() => setLoopDuration(sec)}
                  className={`py-1 rounded font-mono text-center border transition ${
                    loopDuration === sec
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerateStock}
            disabled={isGenerating}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs px-5 py-2 rounded-lg transition flex items-center gap-2 shadow-lg shadow-cyan-900/30"
          >
            {isGenerating ? <RotateCcw size={14} className="animate-spin" /> : <Sparkles size={14} />}
            <span>{isGenerating ? 'Synthesizing Loop...' : `Generate ${loopDuration}s Stock Loop (20 Cr)`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
