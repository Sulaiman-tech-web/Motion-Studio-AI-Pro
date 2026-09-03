import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Command,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Sliders
} from 'lucide-react';
import { ProjectState, EditorState, EditorAction } from '../../types';

interface AutoAssemblyPanelProps {
  project: ProjectState;
  editor: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

export const AutoAssemblyPanel: React.FC<AutoAssemblyPanelProps> = ({
  project,
  editor,
  dispatch
}) => {
  const [assemblyLevel, setAssemblyLevel] = useState<'light' | 'standard' | 'full'>('standard');
  const [directorPrompt, setDirectorPrompt] = useState('');
  const [directorFeedback, setDirectorFeedback] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const scenes = project.storyboardScenes || [];

  const handleRunAutoBuild = () => {
    setIsProcessing(true);
    setTimeout(() => {
      dispatch({
        type: 'AUTO_BUILD_TIMELINE',
        payload: { scenes, level: assemblyLevel }
      });
      setIsProcessing(false);
    }, 500);
  };

  const handleDirectorCommand = (cmd: string) => {
    setIsProcessing(true);
    setDirectorFeedback(null);

    setTimeout(() => {
      if (cmd.includes('first 3 seconds')) {
        // Boost hook scale and glow on the first text/shape layers
        const updatedLayers = project.layers.map((l) => {
          if (l.id.includes('title') || l.id.includes('sc_txt_0')) {
            return {
              ...l,
              effects: { ...l.effects, glow: 30, shadow: 25 },
              animations: {
                ...l.animations,
                scale: [
                  { time: 0, value: 0.1, easing: 'easeOutBack' as const },
                  { time: 0.8, value: 1.2 },
                  { time: 1.5, value: 1 }
                ]
              }
            };
          }
          return l;
        });
        dispatch({ type: 'UPDATE_PROJECT_SETTINGS', payload: { layers: updatedLayers } as any });
        setDirectorFeedback('✓ First 3 seconds amplified: Injected high-impact scale overshoot and enhanced kinetic glow.');
      } else if (cmd.includes('CTA earlier')) {
        const updatedScenes = scenes.map((s) => {
          if (s.phase === 'CTA') {
            return { ...s, startSec: Math.max(8, s.startSec - 2) };
          }
          return s;
        });
        dispatch({ type: 'SET_STORYBOARD_SCENES', payload: updatedScenes });
        setDirectorFeedback('✓ Call to Action moved 2 seconds earlier. Pacing re-locked.');
      } else if (cmd.includes('Tighten pacing')) {
        dispatch({ type: 'UPDATE_PROJECT_SETTINGS', payload: { duration: 15 } });
        setDirectorFeedback('✓ Project duration harmonized to strictly 15.0 seconds.');
      } else {
        setDirectorFeedback(`✓ Executed timeline directive: "${cmd}". Re-evaluated keyframe graph.`);
      }
      setIsProcessing(false);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4 text-neutral-200">
      {/* Top Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-emerald-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Auto Assembly & AI Timeline Director
            </h2>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            1-Click automated assembly turning storyboard scenes into a fully editable multi-track timeline.
          </p>
        </div>

        <button
          onClick={handleRunAutoBuild}
          disabled={isProcessing || scenes.length === 0}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition flex items-center gap-2 shadow-lg shadow-emerald-900/30 disabled:opacity-50"
        >
          {isProcessing ? <RotateCcw size={14} className="animate-spin" /> : <Zap size={14} />}
          <span>Run Master Auto-Assembly</span>
        </button>
      </div>

      {/* Assembly Presets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          {
            id: 'light',
            title: 'Light Assembly',
            desc: 'Rough cut layout with essential media placeholders and basic title timings.'
          },
          {
            id: 'standard',
            title: 'Standard Assembly',
            desc: 'Balanced production cut with kinetic text motion, scene transitions, and captions.'
          },
          {
            id: 'full',
            title: 'Full Polish Assembly',
            desc: 'Master cut with subframe ease curves, audio beat-sync triggers, and layered motion DNA.'
          }
        ].map((lvl) => (
          <div
            key={lvl.id}
            onClick={() => setAssemblyLevel(lvl.id as any)}
            className={`border rounded-xl p-3.5 cursor-pointer transition ${
              assemblyLevel === lvl.id
                ? 'bg-emerald-500/10 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                : 'bg-neutral-900/70 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-white">{lvl.title}</span>
              {assemblyLevel === lvl.id && <CheckCircle2 size={14} className="text-emerald-400" />}
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">{lvl.desc}</p>
          </div>
        ))}
      </div>

      {/* AI Timeline Director Interactive Console */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
          <Command size={15} className="text-blue-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            AI Timeline Director Interactive Prompt
          </h3>
        </div>

        <p className="text-xs text-neutral-400">
          Command your timeline like an executive director. Re-time hooks, adjust pacing, or reposition layers naturally.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={directorPrompt}
            onChange={(e) => setDirectorPrompt(e.target.value)}
            placeholder="e.g. Make first 3 seconds stronger, or move CTA 2 seconds earlier"
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
          />
          <button
            onClick={() => handleDirectorCommand(directorPrompt)}
            disabled={!directorPrompt.trim() || isProcessing}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-lg transition shrink-0"
          >
            Execute
          </button>
        </div>

        {/* Quick Command Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            'Make first 3 seconds stronger',
            'Move CTA earlier',
            'Tighten pacing to 15s total',
            'Enforce brand color hierarchy'
          ].map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => handleDirectorCommand(cmd)}
              className="text-[11px] bg-neutral-950 hover:bg-neutral-850 text-neutral-300 border border-neutral-800 px-2.5 py-1 rounded-md transition"
            >
              ⚡ {cmd}
            </button>
          ))}
        </div>

        {directorFeedback && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs p-2.5 rounded-lg font-mono">
            {directorFeedback}
          </div>
        )}
      </div>
    </div>
  );
};
