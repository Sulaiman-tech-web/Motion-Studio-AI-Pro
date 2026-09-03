import React, { useState } from 'react';
import {
  FileCode,
  Clock,
  Sparkles,
  Scissors,
  Maximize2,
  Zap,
  ArrowRight,
  Volume2,
  CheckCircle2
} from 'lucide-react';
import { ProjectState, EditorState, EditorAction, StoryboardSceneV2 } from '../../types';

interface ScriptTimingPanelProps {
  project: ProjectState;
  editor: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

export const ScriptTimingPanel: React.FC<ScriptTimingPanelProps> = ({
  project,
  editor,
  dispatch
}) => {
  const scenes = project.storyboardScenes || [];
  const [speechRate, setSpeechRate] = useState<number>(1.0); // 1.0 = standard 140-150 words per min
  const [toneMode, setToneMode] = useState<'commercial' | 'documentary' | 'energetic' | 'minimal'>('commercial');

  const totalWords = scenes.reduce((acc, s) => acc + (s.voiceover ? s.voiceover.split(/\s+/).filter(Boolean).length : 0), 0);
  const wordsPerSec = 2.5 * speechRate;
  const estimatedDuration = Math.max(1, Number((totalWords / wordsPerSec).toFixed(1)));

  const handleUpdateVoiceover = (id: string, text: string) => {
    dispatch({
      type: 'UPDATE_STORYBOARD_SCENE',
      payload: { id, updates: { voiceover: text } }
    });
  };

  const handleShortenTo10s = () => {
    const updated = scenes.map((s, idx) => {
      let trimmed = s.voiceover;
      if (idx === 0) trimmed = 'Pure silence. Total clarity.';
      if (idx === 1) trimmed = '40dB Hybrid ANC.';
      if (idx === 2) trimmed = '60-hour wireless endurance.';
      if (idx === 3) trimmed = 'Hear tomorrow. Order now.';
      return {
        ...s,
        voiceover: trimmed,
        startSec: idx * 2.5,
        endSec: (idx + 1) * 2.5
      };
    });
    dispatch({ type: 'SET_STORYBOARD_SCENES', payload: updated });
    dispatch({ type: 'UPDATE_PROJECT_SETTINGS', payload: { duration: 10 } });
  };

  const handleExpandTo20s = () => {
    const updated = scenes.map((s, idx) => {
      let expanded = s.voiceover;
      if (idx === 0) expanded = 'Silence is not simply the absence of noise. It is the beginning of total creative clarity.';
      if (idx === 1) expanded = 'Powered by proprietary 40dB hybrid active noise cancellation, your environment adapts to you in real-time.';
      if (idx === 2) expanded = 'Engineered for seamless movement with 60 continuous hours of high-fidelity spatial battery life.';
      if (idx === 3) expanded = 'Ascend into unprecedented acoustic focus. Experience Aura Pro today at motionstudio.ai.';
      return {
        ...s,
        voiceover: expanded,
        startSec: idx * 5,
        endSec: (idx + 1) * 5
      };
    });
    dispatch({ type: 'SET_STORYBOARD_SCENES', payload: updated });
    dispatch({ type: 'UPDATE_PROJECT_SETTINGS', payload: { duration: 20 } });
  };

  const handleMakePunchier = () => {
    const updated = scenes.map((s, idx) => {
      let punchy = s.voiceover;
      if (idx === 0) punchy = 'Zero noise. Pure sound.';
      if (idx === 1) punchy = 'Engineered titanium precision.';
      if (idx === 2) punchy = 'All day. All night.';
      if (idx === 3) punchy = 'Aura Pro. Available now.';
      return {
        ...s,
        voiceover: punchy
      };
    });
    dispatch({ type: 'SET_STORYBOARD_SCENES', payload: updated });
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4 text-neutral-200">
      {/* Metric Header Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCode size={16} className="text-blue-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Script Generator & Speaking Duration Engine
            </h2>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Voice-over cadence tracking with real-time word counting and subsecond speech duration matching.
          </p>
        </div>

        {/* Speed & Word Stats Pill */}
        <div className="flex items-center gap-3">
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 flex items-center gap-3 text-xs">
            <div>
              <span className="text-[10px] text-neutral-500 uppercase font-bold block">Words</span>
              <span className="font-mono font-bold text-white">{totalWords}</span>
            </div>
            <div className="h-6 w-px bg-neutral-800" />
            <div>
              <span className="text-[10px] text-neutral-500 uppercase font-bold block">Speech Est.</span>
              <span className="font-mono font-bold text-emerald-400">{estimatedDuration}s</span>
            </div>
            <div className="h-6 w-px bg-neutral-800" />
            <div>
              <span className="text-[10px] text-neutral-500 uppercase font-bold block">Target</span>
              <span className="font-mono font-bold text-blue-400">{project.duration}s</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs">
            <Clock size={13} className="text-neutral-500" />
            <span className="text-[10px] font-bold text-neutral-400">Pace:</span>
            <select
              value={speechRate}
              onChange={(e) => setSpeechRate(Number(e.target.value))}
              className="bg-transparent text-white font-mono text-xs outline-none cursor-pointer"
            >
              <option value="0.85">0.85x (Calm)</option>
              <option value="1.0">1.0x (Standard)</option>
              <option value="1.15">1.15x (Energetic)</option>
              <option value="1.3">1.3x (Commercial)</option>
            </select>
          </div>
        </div>
      </div>

      {/* AI Quick Tuning Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-neutral-400 font-medium">Quick Rewrite AI:</span>
        <button
          onClick={handleShortenTo10s}
          className="text-xs bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 px-3 py-1 rounded-lg transition flex items-center gap-1.5"
        >
          <Scissors size={13} className="text-amber-400" />
          <span>Shorten to 10s (60 words)</span>
        </button>
        <button
          onClick={handleExpandTo20s}
          className="text-xs bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 px-3 py-1 rounded-lg transition flex items-center gap-1.5"
        >
          <Maximize2 size={13} className="text-blue-400" />
          <span>Expand to 20s (Narrative)</span>
        </button>
        <button
          onClick={handleMakePunchier}
          className="text-xs bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 px-3 py-1 rounded-lg transition flex items-center gap-1.5"
        >
          <Zap size={13} className="text-rose-400" />
          <span>Make Punchier & Direct</span>
        </button>
      </div>

      {/* Script Scene By Scene Breakdown */}
      <div className="space-y-3">
        {scenes.map((scene, idx) => {
          const words = scene.voiceover ? scene.voiceover.split(/\s+/).filter(Boolean).length : 0;
          const estSec = Number((words / wordsPerSec).toFixed(1));
          const allocatedSec = scene.endSec - scene.startSec;
          const isOverflow = estSec > allocatedSec;

          return (
            <div
              key={scene.id}
              className={`bg-neutral-900/80 border rounded-xl p-3.5 transition ${
                isOverflow ? 'border-amber-500/50' : 'border-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700">
                    SCENE 0{scene.sceneNumber} • {scene.phase.toUpperCase()}
                  </span>
                  <span className="text-xs font-semibold text-white">{scene.title}</span>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="text-neutral-400">{words} words</span>
                  <span className="text-neutral-600">•</span>
                  <span className={isOverflow ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                    {estSec}s speaking time
                  </span>
                  <span className="text-neutral-500 text-[10px]">
                    (Slot: {allocatedSec}s)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
                    Spoken Script (Voiceover Dialogue)
                  </label>
                  <textarea
                    rows={2}
                    value={scene.voiceover}
                    onChange={(e) => handleUpdateVoiceover(scene.id, e.target.value)}
                    placeholder="Enter spoken voiceover..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-neutral-100 outline-none focus:border-blue-500 resize-none font-sans"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
                  <span>Visual cue: {scene.visualDescription}</span>
                  {isOverflow && (
                    <span className="text-amber-400 text-[10px] font-medium">
                      ⚠️ Speech duration exceeds scene window by {(estSec - allocatedSec).toFixed(1)}s
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={() => dispatch({ type: 'SET_CREATE_SUB_TAB', payload: 'voice' })}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition flex items-center gap-1.5 shadow-md shadow-blue-600/20"
        >
          <span>Send Script to AI Voice Studio</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
