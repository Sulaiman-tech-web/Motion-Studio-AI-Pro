import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Video,
  Sparkles,
  Scissors,
  Layers,
  Wand2,
  RefreshCw,
  Plus,
  Coins,
  ShieldAlert,
  Sun,
  Sliders,
  CheckCircle2,
  Clock,
  Download
} from 'lucide-react';
import { ProjectState, EditorState, EditorAction, GeneratedAsset, Layer } from '../../types';
import { GenerativeMediaProvider } from '../../services/generativeMediaProvider';
import { generateId } from '../../utils/animation';

interface GenerativeMediaStorePanelProps {
  project: ProjectState;
  editor: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

export const GenerativeMediaStorePanel: React.FC<GenerativeMediaStorePanelProps> = ({
  project,
  editor,
  dispatch
}) => {
  const [toolMode, setToolMode] = useState<
    'text_image' | 'text_video' | 'broll' | 'product_cutout' | 'relight'
  >('text_image');

  const [prompt, setPrompt] = useState(
    'Aura Pro titanium wireless headphones floating on dark marble pedestal, dramatic blue rim light, 8k commercial render'
  );
  const [negativePrompt, setNegativePrompt] = useState('blurry, low quality, noise, watermark, distorted, plastic');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '4:5'>('16:9');
  const [quality, setQuality] = useState<'fast' | 'balanced' | 'quality' | 'max'>('balanced');
  const [cameraMotion, setCameraMotion] = useState('Slow Push In Orbit');
  const [durationSec, setDurationSec] = useState(4);
  const [seed, setSeed] = useState(42);
  const [seedLocked, setSeedLocked] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const provider = GenerativeMediaProvider.getInstance();
  const estimatedCost = provider.estimateCredits(
    toolMode === 'text_video' ? 'video' : toolMode === 'broll' ? 'broll' : toolMode === 'product_cutout' ? 'cutout' : 'image',
    quality
  );

  const handleGenerate = async () => {
    if (editor.renderCredits < estimatedCost) {
      alert('Insufficient Render Credits. Please add credits.');
      return;
    }

    setIsGenerating(true);
    const activeSeed = seedLocked ? seed : Math.floor(Math.random() * 9999999);
    if (!seedLocked) setSeed(activeSeed);

    dispatch({ type: 'DEDUCT_CREDITS', payload: estimatedCost });

    const jobId = `job_${generateId()}`;
    dispatch({
      type: 'ADD_GENERATION_JOB',
      payload: {
        id: jobId,
        assetId: '',
        type: toolMode,
        prompt,
        status: 'generating',
        progress: 15,
        creditCost: estimatedCost,
        startedAt: Date.now()
      }
    });

    try {
      let result: GeneratedAsset;

      if (toolMode === 'text_video' || toolMode === 'broll') {
        result = await provider.generateVideo({
          prompt,
          durationSec,
          aspectRatio,
          cameraMovement: cameraMotion,
          motionIntensity: 0.8
        });
      } else {
        result = await provider.generateImage({
          prompt,
          negativePrompt,
          aspectRatio,
          style: 'Cinematic High Contrast Studio',
          quality,
          seed: activeSeed
        });
      }

      if (toolMode === 'product_cutout') {
        result = await provider.generateCutout(result);
      }

      dispatch({ type: 'ADD_GENERATED_ASSET', payload: result });
      dispatch({
        type: 'UPDATE_GENERATION_JOB',
        payload: {
          id: jobId,
          updates: { status: 'complete', progress: 100, assetId: result.id }
        }
      });
    } catch (err: any) {
      dispatch({
        type: 'UPDATE_GENERATION_JOB',
        payload: { id: jobId, updates: { status: 'failed', error: err.message } }
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddAsLayer = (asset: GeneratedAsset) => {
    const isVid = asset.generationType === 'video';
    const newLayer: Layer = {
      id: `${isVid ? 'vid' : 'img'}_${generateId()}`,
      name: `AI ${asset.generationType.toUpperCase()} • ${asset.prompt.slice(0, 18)}...`,
      type: 'image', // Uses standard canvas image rendering
      mediaUrl: asset.assetUrl,
      baseProps: {
        x: project.resolution.w / 2,
        y: project.resolution.h / 2,
        width: Math.round(project.resolution.w * 0.45),
        height: Math.round(project.resolution.w * 0.45),
        fill: '#ffffff',
        opacity: 1,
        rotation: 0,
        scale: 1,
        borderRadius: '16px'
      },
      effects: { blur: 0, shadow: 20, glow: 10 },
      animations: {
        scale: [
          { time: editor.currentTime, value: 0.8, easing: 'easeOutBack' },
          { time: Math.min(project.duration, editor.currentTime + 1.2), value: 1 }
        ],
        opacity: [
          { time: editor.currentTime, value: 0, easing: 'linear' },
          { time: Math.min(project.duration, editor.currentTime + 0.5), value: 1 }
        ]
      },
      provenance: 'ai_generated',
      sourceFps: isVid ? 60 : undefined
    };

    dispatch({ type: 'ADD_LAYER', payload: newLayer });
  };

  const assets = project.generatedAssets || [];

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4 text-neutral-200">
      {/* Studio Header & Tool Switcher */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-purple-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Generative Media Studio Pro V6
              </h2>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Production-grade generative AI with deterministic seeds, provenance tracking, and credit estimation.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded-lg text-xs">
            <Coins size={14} className="text-amber-400" />
            <span className="text-neutral-400">Available Credits:</span>
            <span className="font-mono font-bold text-amber-300">{editor.renderCredits}</span>
          </div>
        </div>

        {/* Tool selector buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs">
          {[
            { id: 'text_image', label: 'Text-to-Image', icon: ImageIcon },
            { id: 'text_video', label: 'Text-to-Video', icon: Video },
            { id: 'broll', label: 'AI B-Roll Gen', icon: Wand2 },
            { id: 'product_cutout', label: 'Cutout + Studio Shadow', icon: Scissors },
            { id: 'relight', label: 'Smart Relight', icon: Sun }
          ].map((t) => {
            const Icon = t.icon;
            const isActive = toolMode === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setToolMode(t.id as any)}
                className={`py-1.5 px-2 rounded-md font-medium flex items-center justify-center gap-1.5 transition text-[11px] ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Icon size={13} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Generation Parameters Form */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 space-y-3.5">
        <div>
          <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
            Prompt / Scene Description
          </label>
          <textarea
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-purple-500 resize-none font-sans"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
            Negative Prompt (Exclusions)
          </label>
          <input
            type="text"
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 outline-none focus:border-purple-500"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
              Aspect Ratio
            </label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as any)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white outline-none text-xs"
            >
              <option value="16:9">16:9 Landscape (YouTube/TV)</option>
              <option value="9:16">9:16 Vertical (TikTok/Reels)</option>
              <option value="1:1">1:1 Square (Instagram Feed)</option>
              <option value="4:5">4:5 Portrait</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
              Engine Quality
            </label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value as any)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white outline-none text-xs"
            >
              <option value="fast">Fast (Turbo Draft)</option>
              <option value="balanced">Balanced (Standard 4K)</option>
              <option value="quality">Quality (Super-Detail)</option>
              <option value="max">Max (Master 120 FPS Ready)</option>
            </select>
          </div>

          {(toolMode === 'text_video' || toolMode === 'broll') && (
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
                Camera Motion
              </label>
              <select
                value={cameraMotion}
                onChange={(e) => setCameraMotion(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white outline-none text-xs"
              >
                <option value="Slow Push In Orbit">Slow Push In Orbit</option>
                <option value="Dynamic Pan Right">Dynamic Pan Right</option>
                <option value="Macro Crane Down">Macro Crane Down</option>
                <option value="Speed Ramp Zoom">Speed Ramp Zoom</option>
              </select>
            </div>
          )}

          <div>
            <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
              Deterministic Seed
            </label>
            <div className="flex gap-1.5">
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(Number(e.target.value))}
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1 text-white font-mono text-xs"
              />
              <button
                onClick={() => setSeedLocked(!seedLocked)}
                className={`px-2 py-1 rounded text-[10px] font-bold border transition ${
                  seedLocked
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                }`}
              >
                {seedLocked ? 'LOCKED' : 'RANDOM'}
              </button>
            </div>
          </div>
        </div>

        {/* Generate Action Button with Credit Cost */}
        <div className="pt-2 flex items-center justify-between">
          <div className="text-xs text-neutral-400 flex items-center gap-1.5">
            <Coins size={13} className="text-amber-400" />
            <span>Estimated Cost:</span>
            <span className="font-mono font-bold text-white">{estimatedCost} Credits</span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs px-5 py-2 rounded-lg shadow-lg shadow-purple-900/30 flex items-center gap-2 transition disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
            <span>{isGenerating ? 'Rendering High-Fidelity Asset...' : 'Generate Asset'}</span>
          </button>
        </div>
      </div>

      {/* Generated Assets Gallery & Asset Bin */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
          <div className="flex items-center gap-2">
            <Layers size={15} className="text-blue-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Project Asset Bin ({assets.length})
            </h3>
          </div>
          <span className="text-[11px] text-neutral-500">Click to insert directly into Timeline</span>
        </div>

        {assets.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-neutral-800 rounded-lg text-neutral-500 text-xs">
            No assets generated yet. Click "Generate Asset" above to synthesize images, 60fps video clips, or cutouts.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden group hover:border-purple-500 transition relative flex flex-col"
              >
                <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                  <img src={asset.assetUrl} alt={asset.prompt} className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1 bg-black/70 px-1.5 py-0.5 rounded text-[9px] font-mono text-neutral-300">
                    {asset.generationType.toUpperCase()}
                  </div>
                </div>

                <div className="p-2.5 flex-1 flex flex-col justify-between">
                  <p className="text-[10px] text-neutral-300 font-medium line-clamp-1 mb-1">
                    {asset.prompt}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-neutral-850">
                    <span className="text-[9px] font-mono text-neutral-500">v{asset.version}</span>
                    <button
                      onClick={() => handleAddAsLayer(asset)}
                      className="text-[10px] bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white px-2 py-0.5 rounded transition flex items-center gap-1 font-bold"
                    >
                      <Plus size={10} />
                      <span>Add Layer</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
