import React, { useState } from 'react';
import {
  LayoutTemplate,
  Palette,
  Music,
  CheckCircle2,
  Sparkles,
  Zap,
  Play,
  RotateCw,
  Clock,
  Layers,
  Sliders
} from 'lucide-react';
import { ProjectState, EditorState, EditorAction, Layer } from '../types';
import { generateId } from '../utils/animation';

interface TemplatesAndBrandPanelProps {
  project: ProjectState;
  editor: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

const TEMPLATE_PRESETS = [
  {
    id: 'cyberpunk_4k',
    name: 'Cyberpunk 4K Neon',
    description: 'Electric blue and neon magenta cyber elements with high-speed rotation',
    resolution: { w: 3840, h: 2160, label: 'UHD 4K' },
    fps: 60,
    duration: 5,
    colors: ['#0a0a0a', '#3b82f6', '#ec4899'],
    badge: '4K • 60 FPS'
  },
  {
    id: 'kinetic_type',
    name: 'Minimalist Kinetic Type',
    description: 'Clean high-contrast typographic sequence with smooth elastic staging',
    resolution: { w: 1920, h: 1080, label: 'Full HD' },
    fps: 60,
    duration: 4.5,
    colors: ['#000000', '#ffffff', '#60a5fa'],
    badge: '1080p • 60 FPS'
  },
  {
    id: 'gaming_120fps',
    name: '120 FPS Gaming Intro',
    description: 'Ultra-high frame rate energetic animation with high temporal cadence',
    resolution: { w: 2560, h: 1440, label: '1440p QHD' },
    fps: 120,
    duration: 4,
    colors: ['#0f0f13', '#a855f7', '#06b6d4'],
    badge: '1440p • 120 FPS'
  },
  {
    id: 'tiktok_drop',
    name: 'Vertical Social Drop',
    description: '9:16 mobile format tailored for Instagram Reels and TikTok hooks',
    resolution: { w: 1080, h: 1920, label: 'Vertical 1080p' },
    fps: 60,
    duration: 5,
    colors: ['#000000', '#f59e0b', '#ef4444'],
    badge: '9:16 • 60 FPS'
  },
  {
    id: 'cinema_master',
    name: 'Cinema Master 4K',
    description: '24.00 FPS filmic cadence with cinematic widescreen proportion',
    resolution: { w: 4096, h: 2160, label: 'DCI 4K' },
    fps: 24,
    duration: 6,
    colors: ['#050505', '#e2e8f0', '#d97706'],
    badge: 'DCI 4K • 24 FPS'
  }
];

export const TemplatesAndBrandPanel: React.FC<TemplatesAndBrandPanelProps> = ({
  project,
  editor,
  dispatch
}) => {
  const [activeSection, setActiveSection] = useState<'templates' | 'brand' | 'audio'>('templates');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Brand Kit local state
  const [primaryColor, setPrimaryColor] = useState(project.brandKit?.primaryColor || '#3b82f6');
  const [secondaryColor, setSecondaryColor] = useState(project.brandKit?.secondaryColor || '#6366f1');
  const [accentColor, setAccentColor] = useState(project.brandKit?.accentColor || '#ec4899');
  const [headlineFont, setHeadlineFont] = useState(project.brandKit?.headlineFont || 'Inter, sans-serif');

  // Beat Sync state
  const [bpm, setBpm] = useState(editor.beatSync?.bpm || 128);

  const handleLoadTemplate = (template: typeof TEMPLATE_PRESETS[0]) => {
    const W = template.resolution.w;
    const H = template.resolution.h;

    const layers: Layer[] = [
      {
        id: `bg_${generateId()}`,
        name: 'Dark Studio Base',
        type: 'rect',
        baseProps: {
          x: W / 2,
          y: H / 2,
          width: W,
          height: H,
          fill: template.colors[0],
          opacity: 1,
          rotation: 0,
          scale: 1
        },
        effects: { blur: 0, shadow: 0 },
        animations: {}
      },
      {
        id: `ring_${generateId()}`,
        name: 'Accent Ring',
        type: 'circle',
        baseProps: {
          x: W / 2,
          y: H / 2,
          width: Math.min(W, H) * 0.42,
          height: Math.min(W, H) * 0.42,
          fill: 'transparent',
          stroke: template.colors[2],
          strokeWidth: 4,
          borderRadius: '50%',
          opacity: 1,
          rotation: 0,
          scale: 1
        },
        effects: { blur: 0, shadow: 15, glow: 20 },
        animations: {
          rotation: [
            { time: 0, value: 0, easing: 'linear' },
            { time: template.duration, value: 360 }
          ],
          scale: [
            { time: 0, value: 0.1, easing: 'bounce' },
            { time: 1.0, value: 1 }
          ]
        }
      },
      {
        id: `card_${generateId()}`,
        name: 'Hero Geometric Element',
        type: 'rect',
        baseProps: {
          x: W / 2,
          y: H / 2,
          width: Math.min(W, H) * 0.32,
          height: Math.min(W, H) * 0.32,
          fill: template.colors[1],
          borderRadius: '24px',
          opacity: 1,
          rotation: 0,
          scale: 1
        },
        effects: { blur: 0, shadow: 25, glow: 15 },
        animations: {
          scale: [
            { time: 0.5, value: 0.2, easing: 'easeOutBack' },
            { time: 1.5, value: 1 }
          ]
        }
      },
      {
        id: `txt_${generateId()}`,
        name: 'Main Title',
        type: 'text',
        text: template.name.toUpperCase(),
        baseProps: {
          x: W / 2,
          y: H / 2,
          width: 800,
          height: 120,
          fill: '#ffffff',
          fontSize: Math.min(W, H) * 0.065,
          fontWeight: '900',
          letterSpacing: '2px',
          opacity: 1,
          rotation: 0,
          scale: 1
        },
        effects: { blur: 0, shadow: 15 },
        animations: {
          scale: [
            { time: 0.8, value: 0.2, easing: 'easeOutBack' },
            { time: 1.8, value: 1 }
          ],
          opacity: [
            { time: 0.8, value: 0, easing: 'linear' },
            { time: 1.3, value: 1 }
          ]
        }
      }
    ];

    dispatch({
      type: 'LOAD_PROJECT',
      payload: {
        id: `proj_${generateId()}`,
        name: template.name,
        resolution: template.resolution,
        fps: template.fps,
        duration: template.duration,
        layers
      }
    });

    setStatusNotice(`Loaded template: ${template.name}`);
  };

  const handleApplyBrandKit = () => {
    // Save brand kit to project settings
    dispatch({
      type: 'UPDATE_PROJECT_SETTINGS',
      payload: {
        brandKit: {
          primaryColor,
          secondaryColor,
          accentColor,
          headlineFont,
          bodyFont: 'sans-serif'
        }
      }
    });

    // Update existing layers with brand colors
    project.layers.forEach((layer) => {
      if (layer.id === 'bg_1' || layer.name.toLowerCase().includes('canvas')) return;

      if (layer.type === 'rect') {
        dispatch({
          type: 'COMMIT_PROPERTY',
          payload: { id: layer.id, prop: 'fill', value: primaryColor, time: 0 }
        });
      } else if (layer.type === 'circle') {
        dispatch({
          type: 'COMMIT_PROPERTY',
          payload: { id: layer.id, prop: 'stroke', value: accentColor, time: 0 }
        });
      } else if (layer.type === 'text') {
        dispatch({
          type: 'COMMIT_PROPERTY',
          payload: { id: layer.id, prop: 'fill', value: '#ffffff', time: 0 }
        });
      }
    });

    setStatusNotice('Brand Kit tokens propagated to all project layers!');
  };

  const handleQuantizeToBeats = () => {
    const beatInterval = 60 / bpm; // e.g. 0.5s for 120bpm
    const quarterBeat = beatInterval / 4; // 16th note snap

    project.layers.forEach((layer) => {
      const anims = { ...layer.animations };
      Object.keys(anims).forEach((trackKey) => {
        anims[trackKey] = anims[trackKey].map((kf) => ({
          ...kf,
          time: Number((Math.round(kf.time / quarterBeat) * quarterBeat).toFixed(3))
        }));
      });
      dispatch({ type: 'APPLY_AI_MOTION', payload: { id: layer.id, animations: anims } });
    });

    setStatusNotice(`Quantized all keyframes to ${bpm} BPM rhythm grid`);
  };

  return (
    <div id="templates-and-brand-panel" className="flex flex-col gap-4 text-neutral-300 select-none pb-8">
      {/* Tab Switcher */}
      <div className="flex bg-neutral-900 border border-neutral-800 rounded-xl p-1 gap-1">
        <button
          onClick={() => setActiveSection('templates')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeSection === 'templates'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <LayoutTemplate size={13} />
          <span>Templates</span>
        </button>
        <button
          onClick={() => setActiveSection('brand')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeSection === 'brand'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Palette size={13} />
          <span>Brand Kit</span>
        </button>
        <button
          onClick={() => setActiveSection('audio')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeSection === 'audio'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Music size={13} />
          <span>Beat Sync</span>
        </button>
      </div>

      {statusNotice && (
        <div className="text-xs text-emerald-400 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-800/40 flex items-center gap-2">
          <CheckCircle2 size={14} className="shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* SECTION: TEMPLATES */}
      {activeSection === 'templates' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              High-Fidelity Project Presets
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">1-Click Load</span>
          </div>

          <div className="flex flex-col gap-2">
            {TEMPLATE_PRESETS.map((tmpl) => (
              <div
                key={tmpl.id}
                className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{tmpl.name}</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {tmpl.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {tmpl.colors.map((c, i) => (
                      <span
                        key={i}
                        className="w-3 h-3 rounded-full border border-neutral-700"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-neutral-400 mb-3">{tmpl.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60">
                  <span className="text-[10px] font-mono text-neutral-500">
                    {tmpl.resolution.w}×{tmpl.resolution.h} • {tmpl.duration}s
                  </span>
                  <button
                    onClick={() => handleLoadTemplate(tmpl)}
                    className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 hover:text-white rounded-lg transition"
                  >
                    Load Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: BRAND KIT */}
      {activeSection === 'brand' && (
        <div className="flex flex-col gap-4">
          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
            <div className="text-xs font-bold text-white mb-1 flex items-center gap-2">
              <Palette size={14} className="text-blue-400" /> Global Style Tokens
            </div>
            <p className="text-[11px] text-neutral-400 mb-3">
              Define master palette colors and typography tokens that propagate automatically to all
              active and generated layers.
            </p>

            <div className="space-y-3">
              {/* Primary Color */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-300">Primary Brand</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-neutral-400">{primaryColor}</span>
                </div>
              </div>

              {/* Secondary Color */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-300">Secondary Accent</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-neutral-400">{secondaryColor}</span>
                </div>
              </div>

              {/* Highlight Neon */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-300">Glow / Highlight</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-neutral-400">{accentColor}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleApplyBrandKit}
              className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold text-white transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/20"
            >
              <Sparkles size={14} />
              <span>Apply Brand Kit to All Layers</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION: AUDIO BEAT SYNC */}
      {activeSection === 'audio' && (
        <div className="flex flex-col gap-4">
          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Music size={14} className="text-purple-400" /> Audio Beat Sync Engine V2
              </div>
              <span className="text-[10px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/20 font-mono">
                BPM: {bpm}
              </span>
            </div>

            <p className="text-[11px] text-neutral-400 mb-3">
              Synchronizes animation timing curves with musical tempo grid and modulates dynamic
              pulses.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">
                  Tempo Preset (BPM)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[120, 124, 128, 140].map((val) => (
                    <button
                      key={val}
                      onClick={() => setBpm(val)}
                      className={`py-1.5 rounded-lg text-xs font-mono font-bold transition border ${
                        bpm === val
                          ? 'bg-purple-600/30 text-purple-300 border-purple-500/50'
                          : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                      }`}
                    >
                      {val} BPM
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800 space-y-2">
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_BEAT_SYNC', payload: { bpm } })}
                  className={`w-full py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 border ${
                    editor.beatSync.enabled
                      ? 'bg-purple-600 text-white border-purple-500'
                      : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:bg-neutral-800'
                  }`}
                >
                  <Zap size={14} className={editor.beatSync.enabled ? 'text-amber-300' : ''} />
                  <span>
                    {editor.beatSync.enabled ? 'Beat Pulse Mode: ACTIVE' : 'Enable Beat Pulse Mode'}
                  </span>
                </button>

                <button
                  onClick={handleQuantizeToBeats}
                  className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs font-bold text-neutral-200 hover:text-white transition flex items-center justify-center gap-2"
                >
                  <Clock size={14} />
                  <span>Snap & Quantize All Keyframes to Beat Grid</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
