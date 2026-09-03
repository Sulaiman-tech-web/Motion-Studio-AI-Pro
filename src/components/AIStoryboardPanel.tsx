import React, { useState } from 'react';
import {
  Film,
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Wand2,
  Tv,
  Zap
} from 'lucide-react';
import { ProjectState, EditorState, EditorAction, Layer, StoryboardScene } from '../types';
import { generateId } from '../utils/animation';

interface AIStoryboardPanelProps {
  project: ProjectState;
  editor: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

const DEFAULT_STORYBOARD_TEMPLATES = [
  {
    title: 'Cyberpunk Tech Teaser',
    prompt: 'Futuristic AI hardware teaser with glowing rings and high-speed kinetic typography',
    duration: 5,
    scenes: [
      {
        id: 's1',
        title: 'The Cyber Hook',
        phase: 'Hook' as const,
        duration: 1.2,
        description: 'Dark void with electric blue glowing pulse and glitch entrance',
        motionStyle: 'Snap zoom + Electric Glow'
      },
      {
        id: 's2',
        title: 'Core Hardware Reveal',
        phase: 'Reveal' as const,
        duration: 1.6,
        description: 'Rotating neon accent ring framing central geometric core',
        motionStyle: '360° Infinite Spin + Elastic scale'
      },
      {
        id: 's3',
        title: 'Feature Telemetry',
        phase: 'Features' as const,
        duration: 1.4,
        description: 'Floating telemetry data points with high contrast kinetic copy',
        motionStyle: 'Staggered vertical slide + Easing'
      },
      {
        id: 's4',
        title: 'CTA & Brand Lockup',
        phase: 'CTA' as const,
        duration: 0.8,
        description: 'High-impact brand lockup and glowing action box',
        motionStyle: 'Impact bounce + Glow pulse'
      }
    ]
  },
  {
    title: 'SaaS Platform Launch',
    prompt: 'Clean, minimalist motion design announcing next-generation cloud dashboard',
    duration: 5,
    scenes: [
      {
        id: 's1',
        title: 'Problem Statement',
        phase: 'Hook' as const,
        duration: 1.2,
        description: 'Minimalist bold headline sliding up with smooth damping',
        motionStyle: 'EaseOutBack vertical push'
      },
      {
        id: 's2',
        title: 'Product Interface',
        phase: 'Reveal' as const,
        duration: 1.5,
        description: 'Sleek rounded dashboard card zooming in with clean drop shadow',
        motionStyle: 'Scale 0.2 to 1.0 + Soft blur decay'
      },
      {
        id: 's3',
        title: 'Speed & Metrics',
        phase: 'Features' as const,
        duration: 1.3,
        description: 'Performance ring spinning to 100% with kinetic stats',
        motionStyle: 'Continuous rotation + Pulse'
      },
      {
        id: 's4',
        title: 'Get Started Now',
        phase: 'CTA' as const,
        duration: 1.0,
        description: 'Action button sliding in with prominent high-contrast text',
        motionStyle: 'Elastic bounce entrance'
      }
    ]
  },
  {
    title: 'High-Energy Fashion Drop',
    prompt: 'Ultra-fast 120 FPS streetwear launch with rapid bounce typography',
    duration: 4,
    scenes: [
      {
        id: 's1',
        title: 'Flash Strobe',
        phase: 'Hook' as const,
        duration: 0.8,
        description: 'High cadence typography flashing across screen',
        motionStyle: 'Staggered scale 0 to 1'
      },
      {
        id: 's2',
        title: 'Product Drop',
        phase: 'Reveal' as const,
        duration: 1.4,
        description: 'Centered hero element with neon pink outline',
        motionStyle: 'Elastic pop + Drop shadow'
      },
      {
        id: 's3',
        title: 'Drop Date',
        phase: 'Features' as const,
        duration: 1.0,
        description: 'Kinetic date counter with high contrast badges',
        motionStyle: 'Slide up + Snap'
      },
      {
        id: 's4',
        title: 'Limited Edition',
        phase: 'CTA' as const,
        duration: 0.8,
        description: 'Final urgency lockup with glowing outline',
        motionStyle: 'Smooth zoom push'
      }
    ]
  }
];

export const AIStoryboardPanel: React.FC<AIStoryboardPanelProps> = ({
  project,
  editor,
  dispatch
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStoryboard, setActiveStoryboard] = useState(DEFAULT_STORYBOARD_TEMPLATES[0]);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  const handleGenerateStoryboard = (customPrompt?: string) => {
    setIsGenerating(true);
    setAppliedNotice(null);

    const query = (customPrompt || prompt).toLowerCase();

    setTimeout(() => {
      let chosen = DEFAULT_STORYBOARD_TEMPLATES[0];
      if (query.includes('saas') || query.includes('software') || query.includes('minimal')) {
        chosen = DEFAULT_STORYBOARD_TEMPLATES[1];
      } else if (query.includes('fashion') || query.includes('fast') || query.includes('drop')) {
        chosen = DEFAULT_STORYBOARD_TEMPLATES[2];
      }
      setActiveStoryboard(chosen);
      setIsGenerating(false);
      setAppliedNotice(`Generated 4-Scene Storyboard: "${chosen.title}"`);
    }, 700);
  };

  const applyStoryboardToProject = () => {
    const W = project.resolution.w;
    const H = project.resolution.h;

    // Construct a full project composition based on the storyboard scenes
    const newLayers: Layer[] = [
      {
        id: `bg_${generateId()}`,
        name: 'Dark Studio Canvas',
        type: 'rect',
        baseProps: {
          x: W / 2,
          y: H / 2,
          width: W,
          height: H,
          fill: '#080808',
          opacity: 1,
          rotation: 0,
          scale: 1
        },
        effects: { blur: 0, shadow: 0 },
        animations: {}
      },
      // Accent Ring
      {
        id: `ring_${generateId()}`,
        name: 'Hero Accent Ring',
        type: 'circle',
        baseProps: {
          x: W / 2,
          y: H / 2,
          width: Math.min(W, H) * 0.45,
          height: Math.min(W, H) * 0.45,
          fill: 'transparent',
          stroke: '#3b82f6',
          strokeWidth: 4,
          borderRadius: '50%',
          opacity: 1,
          rotation: 0,
          scale: 1
        },
        effects: { blur: 0, shadow: 15, glow: 25 },
        animations: {
          scale: [
            { time: 0, value: 0.1, easing: 'bounce' },
            { time: 1.2, value: 1 },
            { time: 3.5, value: 1.15, easing: 'easeInOutQuad' },
            { time: 5.0, value: 1.0 }
          ],
          rotation: [
            { time: 0, value: 0, easing: 'linear' },
            { time: 5.0, value: 360 }
          ]
        }
      },
      // Hero Card Box
      {
        id: `box_${generateId()}`,
        name: 'Product Anchor Box',
        type: 'rect',
        baseProps: {
          x: W / 2,
          y: H / 2,
          width: Math.min(W, H) * 0.35,
          height: Math.min(W, H) * 0.35,
          fill: '#171717',
          stroke: '#60a5fa',
          strokeWidth: 2,
          borderRadius: '24px',
          opacity: 1,
          rotation: 0,
          scale: 1
        },
        effects: { blur: 0, shadow: 30, glow: 15 },
        animations: {
          scale: [
            { time: 0.8, value: 0.2, easing: 'easeOutBack' },
            { time: 2.0, value: 1 }
          ],
          opacity: [
            { time: 0.8, value: 0, easing: 'linear' },
            { time: 1.4, value: 1 }
          ]
        }
      },
      // Main Headline Text
      {
        id: `text_head_${generateId()}`,
        name: 'Headline Text',
        type: 'text',
        text: 'FUTURE OF MOTION',
        baseProps: {
          x: W / 2,
          y: H / 2 - Math.min(W, H) * 0.26,
          width: 800,
          height: 120,
          fill: '#ffffff',
          fontSize: Math.min(W, H) * 0.075,
          fontWeight: '900',
          letterSpacing: '2px',
          opacity: 1,
          rotation: 0,
          scale: 1
        },
        effects: { blur: 0, shadow: 20 },
        animations: {
          y: [
            { time: 0, value: H / 2 - Math.min(W, H) * 0.26 + 150, easing: 'easeOutBack' },
            { time: 1.2, value: H / 2 - Math.min(W, H) * 0.26 }
          ],
          opacity: [
            { time: 0, value: 0, easing: 'linear' },
            { time: 0.6, value: 1 }
          ]
        }
      },
      // Call to Action Tag
      {
        id: `text_cta_${generateId()}`,
        name: 'CTA Subtitle',
        type: 'text',
        text: 'PRO 4K • 120 FPS ENGINE',
        baseProps: {
          x: W / 2,
          y: H / 2 + Math.min(W, H) * 0.26,
          width: 600,
          height: 80,
          fill: '#60a5fa',
          fontSize: Math.min(W, H) * 0.038,
          fontWeight: '800',
          letterSpacing: '4px',
          opacity: 1,
          rotation: 0,
          scale: 1
        },
        effects: { blur: 0, shadow: 10, glow: 15 },
        animations: {
          scale: [
            { time: 2.8, value: 0.4, easing: 'bounce' },
            { time: 3.8, value: 1 }
          ],
          opacity: [
            { time: 2.8, value: 0, easing: 'linear' },
            { time: 3.3, value: 1 }
          ]
        }
      }
    ];

    dispatch({
      type: 'UPDATE_PROJECT_SETTINGS',
      payload: { duration: activeStoryboard.duration }
    });

    // Load new layers
    dispatch({
      type: 'LOAD_PROJECT',
      payload: {
        ...project,
        duration: activeStoryboard.duration,
        layers: newLayers
      }
    });

    dispatch({ type: 'SET_TIME', payload: 0 });
    setAppliedNotice(`Applied "${activeStoryboard.title}" to Timeline!`);
  };

  // Determine which scene is active based on currentTime
  let accumulatedTime = 0;
  let activeSceneId = activeStoryboard.scenes[0]?.id;
  for (const sc of activeStoryboard.scenes) {
    if (editor.currentTime >= accumulatedTime && editor.currentTime <= accumulatedTime + sc.duration) {
      activeSceneId = sc.id;
      break;
    }
    accumulatedTime += sc.duration;
  }

  return (
    <div id="ai-storyboard-panel" className="flex flex-col gap-4 text-neutral-300 select-none pb-8">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <Film size={16} /> AI Storyboard Director
          </div>
          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 font-mono font-medium">
            Multi-Scene
          </span>
        </div>
        <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
          Generates structured, multi-scene video narrative boards with coordinated entrance, reveal,
          and closing cadence.
        </p>

        {/* Prompt input */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Cyberpunk sneaker drop, SaaS platform launch..."
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder:text-neutral-600"
          />
          <button
            onClick={() => handleGenerateStoryboard()}
            disabled={isGenerating}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white transition flex items-center gap-1.5 shadow-md shadow-indigo-900/20"
          >
            {isGenerating ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Wand2 size={14} />
            )}
            <span>Generate</span>
          </button>
        </div>

        {/* Quick Template Switcher */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {DEFAULT_STORYBOARD_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.title}
              onClick={() => {
                setActiveStoryboard(tmpl);
                setAppliedNotice(null);
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition border ${
                activeStoryboard.title === tmpl.title
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                  : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
              }`}
            >
              {tmpl.title}
            </button>
          ))}
        </div>
      </div>

      {/* Storyboard Scenes List */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <Tv size={13} className="text-blue-400" /> Storyboard Timeline ({activeStoryboard.scenes.length} Scenes)
          </span>
          <span className="text-[11px] font-mono text-neutral-500 flex items-center gap-1">
            <Clock size={11} /> Total: {activeStoryboard.duration}s
          </span>
        </div>

        {activeStoryboard.scenes.map((scene, idx) => {
          const isActive = scene.id === activeSceneId;
          return (
            <div
              key={scene.id}
              className={`p-3 rounded-xl border transition ${
                isActive
                  ? 'bg-indigo-950/30 border-indigo-500/50 shadow-lg shadow-indigo-950/50 ring-1 ring-indigo-500/30'
                  : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-neutral-800 text-[10px] font-mono font-bold flex items-center justify-center text-neutral-300">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-white">{scene.title}</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-bold">
                    {scene.phase}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                  {scene.duration}s
                </span>
              </div>

              <p className="text-[11px] text-neutral-400 mb-2">{scene.description}</p>

              <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1.5 border-t border-neutral-800/60 font-mono">
                <span className="flex items-center gap-1 text-neutral-400">
                  <Zap size={11} className="text-amber-400" /> {scene.motionStyle}
                </span>
                {isActive && (
                  <span className="text-emerald-400 font-bold animate-pulse">PLAYHEAD ACTIVE</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 1-Click Apply to Timeline */}
      <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/40 to-neutral-900 border border-indigo-900/40">
        <button
          id="btn-apply-storyboard"
          onClick={applyStoryboardToProject}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/30"
        >
          <Sparkles size={15} />
          <span>Apply Storyboard to Project Timeline</span>
        </button>

        {appliedNotice && (
          <div className="mt-2 text-center text-[11px] text-emerald-400 flex items-center justify-center gap-1.5">
            <CheckCircle2 size={13} />
            <span>{appliedNotice}</span>
          </div>
        )}
      </div>
    </div>
  );
};
