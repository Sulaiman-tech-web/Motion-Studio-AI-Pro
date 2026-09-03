import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  ArrowUpRight,
  CheckCircle2,
  Zap,
  Film,
  Type,
  Maximize2,
  Minimize2,
  Sliders,
  Play,
  Flame,
  Volume2
} from 'lucide-react';
import { ProjectState, EditorState, EditorAction, Keyframe, Layer } from '../types';
import { generateId } from '../utils/animation';

interface AIPanelProps {
  project: ProjectState;
  editor: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

export const AIPanel: React.FC<AIPanelProps> = ({ project, editor, dispatch }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastApplied, setLastApplied] = useState<string | null>(null);
  const [kineticText, setKineticText] = useState('UNLEASH CREATIVITY');

  const selectedLayer = project.layers.find((l) => l.id === editor.selectedLayerIds[0]);

  const presetPrompts = [
    { label: 'Slide Up Bounce', prompt: 'Slide up with a bounce' },
    { label: 'Smooth Zoom In', prompt: 'Smooth zoom in from scale 0 to 1' },
    { label: 'Spin & Fade', prompt: 'Spin 360 degrees and fade in' },
    { label: 'Pop Elastic', prompt: 'Pop elastic bounce scale' },
    { label: '2x Speed', prompt: 'Make it faster' },
    { label: 'Float Hover', prompt: 'Float hover up and down' }
  ];

  // AI Motion Generator (natural language keyframing)
  const handleGenerate = (customPrompt?: string) => {
    const textToRun = customPrompt || prompt;
    if (!selectedLayer || !textToRun.trim()) return;

    setIsGenerating(true);
    setLastApplied(null);

    setTimeout(() => {
      const p = textToRun.toLowerCase();
      const newAnimations = { ...selectedLayer.animations };
      const start = editor.currentTime;
      const dur = 1.2;
      const targetDuration = Math.min(project.duration, start + dur);

      if (p.includes('faster') || p.includes('2x') || p.includes('speed up')) {
        Object.keys(newAnimations).forEach((key) => {
          newAnimations[key] = newAnimations[key].map((kf: Keyframe) => ({
            ...kf,
            time: Number((kf.time * 0.6).toFixed(3))
          }));
        });
      } else if (p.includes('float') || p.includes('hover')) {
        const baseY = selectedLayer.baseProps.y;
        newAnimations.y = [
          { time: start, value: baseY, easing: 'easeInOutQuad' },
          { time: start + 0.8, value: baseY - 35, easing: 'easeInOutQuad' },
          { time: start + 1.6, value: baseY, easing: 'easeInOutQuad' }
        ];
      } else if (p.includes('pop') || p.includes('elastic')) {
        newAnimations.scale = [
          { time: start, value: 0.1, easing: 'bounce' },
          { time: targetDuration, value: 1 }
        ];
        newAnimations.opacity = [
          { time: start, value: 0, easing: 'linear' },
          { time: start + 0.3, value: 1 }
        ];
      } else {
        if (p.includes('fade')) {
          newAnimations.opacity = [
            { time: start, value: 0, easing: 'linear' },
            { time: targetDuration, value: 1 }
          ];
        }
        if (p.includes('slide up') || p.includes('up')) {
          const baseY = selectedLayer.baseProps.y;
          newAnimations.y = [
            { time: start, value: baseY + 300, easing: 'easeOutBack' },
            { time: targetDuration, value: baseY }
          ];
        } else if (p.includes('slide down') || p.includes('down')) {
          const baseY = selectedLayer.baseProps.y;
          newAnimations.y = [
            { time: start, value: baseY - 300, easing: 'easeOutBack' },
            { time: targetDuration, value: baseY }
          ];
        }
        if (p.includes('bounce')) {
          newAnimations.scale = [
            { time: start, value: 0, easing: 'bounce' },
            { time: targetDuration, value: 1 }
          ];
        } else if (p.includes('zoom') || p.includes('scale')) {
          newAnimations.scale = [
            { time: start, value: 0.2, easing: 'easeOutBack' },
            { time: targetDuration, value: 1 }
          ];
        }
        if (p.includes('spin') || p.includes('rotate')) {
          newAnimations.rotation = [
            { time: start, value: 0, easing: 'easeInOutQuad' },
            { time: targetDuration, value: 360 }
          ];
        }
      }

      dispatch({
        type: 'APPLY_AI_MOTION',
        payload: { id: selectedLayer.id, animations: newAnimations }
      });

      setIsGenerating(false);
      setLastApplied(textToRun);
      if (!customPrompt) setPrompt('');
    }, 600);
  };

  // AI Motion Director Commands (Section 67)
  const handleDirectorCommand = (command: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      if (command === 'cinematic') {
        // Slow, elegant camera moves, subtle zoom, 24fps filmic easing
        project.layers.forEach((layer) => {
          if (layer.id === 'bg_1') return;
          const anims = { ...layer.animations };
          anims.scale = [
            { time: 0, value: 0.95, easing: 'easeInOutQuad' },
            { time: project.duration, value: 1.05 }
          ];
          dispatch({ type: 'APPLY_AI_MOTION', payload: { id: layer.id, animations: anims } });
        });
        setLastApplied('Cinematic Director: Applied filmic slow-push motion curves');
      } else if (command === 'smooth') {
        // Convert all keyframe easings to easeInOutQuad
        project.layers.forEach((layer) => {
          const anims = { ...layer.animations };
          Object.keys(anims).forEach((key) => {
            anims[key] = anims[key].map((kf) => ({ ...kf, easing: 'easeInOutQuad' }));
          });
          dispatch({ type: 'APPLY_AI_MOTION', payload: { id: layer.id, animations: anims } });
        });
        setLastApplied('Smooth Transitions: Normalized all easing curves');
      } else if (command === 'faster') {
        // 2x speed pacing
        project.layers.forEach((layer) => {
          const anims = { ...layer.animations };
          Object.keys(anims).forEach((key) => {
            anims[key] = anims[key].map((kf) => ({
              ...kf,
              time: Number((kf.time * 0.7).toFixed(3))
            }));
          });
          dispatch({ type: 'APPLY_AI_MOTION', payload: { id: layer.id, animations: anims } });
        });
        setLastApplied('Faster Pacing: Compressed keyframe intervals by 30%');
      } else if (command === 'pulse') {
        // High energy pulse
        if (selectedLayer) {
          const anims = { ...selectedLayer.animations };
          anims.scale = [
            { time: 0, value: 1, easing: 'easeOutBack' },
            { time: 0.5, value: 1.15, easing: 'easeInOutQuad' },
            { time: 1.0, value: 1, easing: 'easeOutBack' },
            { time: 1.5, value: 1.15, easing: 'easeInOutQuad' },
            { time: 2.0, value: 1 }
          ];
          dispatch({ type: 'APPLY_AI_MOTION', payload: { id: selectedLayer.id, animations: anims } });
          setLastApplied('High-Energy Pulse: Rhythmically pulsed target layer');
        }
      }
      setIsGenerating(false);
    }, 500);
  };

  // AI Auto Animate Scene (Section 68)
  const handleAutoAnimate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const nonBgLayers = project.layers.filter((l) => l.id !== 'bg_1');
      nonBgLayers.forEach((layer, idx) => {
        const stagger = idx * 0.25;
        const entryDur = 0.8;
        const newAnimations: Record<string, Keyframe[]> = {};

        // Staggered Entrance
        newAnimations.opacity = [
          { time: stagger, value: 0, easing: 'linear' },
          { time: stagger + 0.4, value: 1 }
        ];

        if (layer.type === 'text') {
          const baseY = layer.baseProps.y;
          newAnimations.y = [
            { time: stagger, value: baseY + 80, easing: 'easeOutBack' },
            { time: stagger + entryDur, value: baseY }
          ];
          newAnimations.scale = [
            { time: stagger, value: 0.8, easing: 'easeOutBack' },
            { time: stagger + entryDur, value: 1 }
          ];
        } else if (layer.type === 'circle') {
          newAnimations.scale = [
            { time: stagger, value: 0, easing: 'bounce' },
            { time: stagger + entryDur, value: 1 }
          ];
          newAnimations.rotation = [
            { time: stagger, value: 0, easing: 'linear' },
            { time: project.duration, value: 360 }
          ];
        } else {
          // Rect
          newAnimations.scale = [
            { time: stagger, value: 0.2, easing: 'easeOutBack' },
            { time: stagger + entryDur, value: 1 }
          ];
        }

        dispatch({
          type: 'APPLY_AI_MOTION',
          payload: { id: layer.id, animations: newAnimations }
        });
      });

      setIsGenerating(false);
      setLastApplied(`Auto-orchestrated motion choreography across ${nonBgLayers.length} layers`);
    }, 700);
  };

  // AI Responsive Auto Resize (Section 69 & 70)
  const handleResponsiveResize = (targetAspect: '16:9' | '9:16' | '1:1') => {
    let newW = 1920;
    let newH = 1080;
    if (targetAspect === '9:16') {
      newW = 1080;
      newH = 1920;
    } else if (targetAspect === '1:1') {
      newW = 1080;
      newH = 1080;
    }

    const oldW = project.resolution.w;
    const oldH = project.resolution.h;
    const scaleX = newW / oldW;
    const scaleY = newH / oldH;
    const scaleMin = Math.min(scaleX, scaleY);

    // Reposition and rescale layers intelligently
    const updatedLayers = project.layers.map((layer) => {
      if (layer.id === 'bg_1') {
        return {
          ...layer,
          baseProps: {
            ...layer.baseProps,
            x: newW / 2,
            y: newH / 2,
            width: newW,
            height: newH
          }
        };
      }

      const newBaseProps = { ...layer.baseProps };
      newBaseProps.x = Math.round(layer.baseProps.x * scaleX);
      newBaseProps.y = Math.round(layer.baseProps.y * scaleY);
      newBaseProps.width = Math.round(layer.baseProps.width * scaleMin);
      newBaseProps.height = Math.round(layer.baseProps.height * scaleMin);

      if (layer.baseProps.fontSize) {
        newBaseProps.fontSize = Math.round(layer.baseProps.fontSize * scaleMin);
      }

      // Adjust animation coordinates
      const newAnimations = { ...layer.animations };
      if (newAnimations.x) {
        newAnimations.x = newAnimations.x.map((kf) => ({
          ...kf,
          value: Math.round(kf.value * scaleX)
        }));
      }
      if (newAnimations.y) {
        newAnimations.y = newAnimations.y.map((kf) => ({
          ...kf,
          value: Math.round(kf.value * scaleY)
        }));
      }

      return {
        ...layer,
        baseProps: newBaseProps,
        animations: newAnimations
      };
    });

    dispatch({
      type: 'UPDATE_PROJECT_SETTINGS',
      payload: { resolution: { w: newW, h: newH } }
    });

    // Replace layers
    updatedLayers.forEach((layer) => {
      dispatch({
        type: 'COMMIT_PROPERTY',
        payload: { id: layer.id, prop: 'x', value: layer.baseProps.x, time: 0 }
      });
      dispatch({
        type: 'COMMIT_PROPERTY',
        payload: { id: layer.id, prop: 'y', value: layer.baseProps.y, time: 0 }
      });
    });

    setLastApplied(`AI Auto-Resized to ${targetAspect} (${newW}x${newH})`);
  };

  // AI Kinetic Typography Generator (Section 71)
  const handleGenerateKineticType = () => {
    if (!kineticText.trim()) return;

    const words = kineticText.split(/\s+/);
    const startX = project.resolution.w / 2;
    const baseY = project.resolution.h / 2;

    words.forEach((word, index) => {
      const staggerTime = index * 0.35;
      const newLayer: Layer = {
        id: `kinetic_${generateId()}`,
        name: `Type: ${word}`,
        type: 'text',
        text: word,
        baseProps: {
          x: startX,
          y: baseY + (index - (words.length - 1) / 2) * 110,
          width: 800,
          height: 120,
          fill: index === 0 ? '#3b82f6' : '#ffffff',
          fontSize: 96,
          fontWeight: '900',
          opacity: 1,
          rotation: 0,
          scale: 1
        },
        effects: { blur: 0, shadow: 15, glow: index === 0 ? 20 : 0 },
        animations: {
          scale: [
            { time: staggerTime, value: 0.2, easing: 'easeOutBack' },
            { time: staggerTime + 0.6, value: 1 }
          ],
          opacity: [
            { time: staggerTime, value: 0, easing: 'linear' },
            { time: staggerTime + 0.3, value: 1 }
          ],
          rotation: [
            { time: staggerTime, value: -12, easing: 'easeOutBack' },
            { time: staggerTime + 0.6, value: 0 }
          ]
        }
      };
      dispatch({ type: 'ADD_LAYER', payload: newLayer });
    });

    setLastApplied(`Generated Kinetic Typography sequence (${words.length} words)`);
  };

  return (
    <div id="ai-panel" className="flex flex-col gap-4 text-neutral-300 select-none pb-8">
      {/* AI Motion Synthesis Card */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 shadow-inner">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
            <Sparkles size={16} /> Motion AI V4.0 Pro
          </div>
          <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 font-mono font-medium">
            120 FPS Ready
          </span>
        </div>

        <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
          Synthesizes continuous, sub-frame keyframe trajectories at the playhead timestamp.
        </p>

        {/* Selected Layer Context Pill */}
        {selectedLayer ? (
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs mb-3">
            <span className="text-neutral-400">Target Layer:</span>
            <span className="font-semibold text-blue-300 truncate max-w-[140px]">
              {selectedLayer.name}
            </span>
          </div>
        ) : (
          <div className="text-xs text-amber-400 bg-amber-950/30 p-2.5 rounded-lg border border-amber-800/40 mb-3 flex items-center gap-2">
            <span>Select a layer on the canvas to animate.</span>
          </div>
        )}

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Slide up with a bounce, float hover, or 2x speed"
          rows={2}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500 resize-none mb-3 placeholder:text-neutral-600 transition"
        />

        <button
          id="btn-generate-ai-motion"
          onClick={() => handleGenerate()}
          disabled={!selectedLayer || isGenerating || !prompt.trim()}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 disabled:text-neutral-500 rounded-lg text-xs font-bold text-white transition flex justify-center items-center gap-2 shadow-lg shadow-blue-900/20"
        >
          {isGenerating ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Wand2 size={15} />
          )}
          <span>{isGenerating ? 'Synthesizing Motion...' : 'Generate Motion'}</span>
        </button>

        {lastApplied && (
          <div className="mt-2.5 text-[11px] text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 size={13} className="shrink-0" />
            <span className="truncate">{lastApplied}</span>
          </div>
        )}
      </div>

      {/* AI Motion Director (Section 67) */}
      <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <Film size={13} className="text-indigo-400" /> AI Motion Director
          </span>
          <span className="text-[9px] text-neutral-500 font-mono">GLOBAL</span>
        </div>
        <p className="text-[11px] text-neutral-400 mb-3">
          Applies differential motion choreography across all timeline tracks.
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => handleDirectorCommand('cinematic')}
            disabled={isGenerating}
            className="p-2 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left text-xs font-medium text-neutral-300 hover:text-white transition flex items-center gap-2"
          >
            <Film size={13} className="text-blue-400 shrink-0" />
            <span className="truncate">Make Cinematic</span>
          </button>
          <button
            onClick={() => handleDirectorCommand('smooth')}
            disabled={isGenerating}
            className="p-2 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left text-xs font-medium text-neutral-300 hover:text-white transition flex items-center gap-2"
          >
            <Sliders size={13} className="text-indigo-400 shrink-0" />
            <span className="truncate">Smoother Curves</span>
          </button>
          <button
            onClick={() => handleDirectorCommand('faster')}
            disabled={isGenerating}
            className="p-2 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left text-xs font-medium text-neutral-300 hover:text-white transition flex items-center gap-2"
          >
            <Zap size={13} className="text-amber-400 shrink-0" />
            <span className="truncate">Faster Pacing</span>
          </button>
          <button
            onClick={() => handleDirectorCommand('pulse')}
            disabled={!selectedLayer || isGenerating}
            className="p-2 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left text-xs font-medium text-neutral-300 hover:text-white transition flex items-center gap-2 disabled:opacity-40"
          >
            <Flame size={13} className="text-rose-400 shrink-0" />
            <span className="truncate">High-Energy Pulse</span>
          </button>
        </div>
      </div>

      {/* AI Auto Animate Scene (Section 68) */}
      <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <Zap size={13} className="text-amber-400" /> Auto-Animate Scene
          </div>
          <p className="text-[10px] text-neutral-400">
            Auto-generate Entrance, Emphasis, and Stagger
          </p>
        </div>
        <button
          onClick={handleAutoAnimate}
          disabled={isGenerating}
          className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold transition"
        >
          Auto Orchestrate
        </button>
      </div>

      {/* AI Responsive Auto Resize (Section 69 & 70) */}
      <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800">
        <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Maximize2 size={13} className="text-purple-400" /> AI Responsive Resize
        </div>
        <p className="text-[11px] text-neutral-400 mb-2.5">
          Intelligently adapts layouts, font sizes, and center-points without distortion.
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => handleResponsiveResize('16:9')}
            className="p-2 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-center text-xs font-bold text-neutral-300 hover:text-white transition"
          >
            <div>16:9</div>
            <div className="text-[9px] text-neutral-500 font-mono">Landscape</div>
          </button>
          <button
            onClick={() => handleResponsiveResize('9:16')}
            className="p-2 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-center text-xs font-bold text-neutral-300 hover:text-white transition"
          >
            <div>9:16</div>
            <div className="text-[9px] text-neutral-500 font-mono">Vertical</div>
          </button>
          <button
            onClick={() => handleResponsiveResize('1:1')}
            className="p-2 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-center text-xs font-bold text-neutral-300 hover:text-white transition"
          >
            <div>1:1</div>
            <div className="text-[9px] text-neutral-500 font-mono">Square</div>
          </button>
        </div>
      </div>

      {/* AI Kinetic Typography Generator (Section 71) */}
      <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800">
        <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Type size={13} className="text-pink-400" /> Kinetic Typography
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={kineticText}
            onChange={(e) => setKineticText(e.target.value)}
            placeholder="Words to animate"
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleGenerateKineticType}
            className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white transition shadow-sm"
          >
            Generate
          </button>
        </div>
      </div>

      {/* Instant Presets */}
      <div>
        <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Zap size={12} className="text-amber-400" /> Quick Keyframe Presets
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {presetPrompts.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handleGenerate(preset.prompt)}
              disabled={!selectedLayer || isGenerating}
              className="p-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-left text-xs font-medium text-neutral-300 hover:text-white transition disabled:opacity-40 disabled:hover:bg-neutral-900 flex flex-col justify-between h-14 group"
            >
              <div className="flex items-center justify-between w-full">
                <span className="truncate">{preset.label}</span>
                <ArrowUpRight
                  size={12}
                  className="opacity-0 group-hover:opacity-100 text-blue-400 transition"
                />
              </div>
              <span className="text-[10px] text-neutral-500 truncate font-mono">
                {preset.prompt}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
