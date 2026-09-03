import React, { useState } from 'react';
import {
  Film,
  Sparkles,
  Play,
  RotateCcw,
  Layers,
  ArrowRight,
  Volume2,
  Video,
  Type,
  Plus,
  Trash2,
  Check,
  Zap,
  Camera
} from 'lucide-react';
import { ProjectState, EditorState, EditorAction, StoryboardSceneV2 } from '../../types';
import { GenerativeMediaProvider } from '../../services/generativeMediaProvider';
import { generateId } from '../../utils/animation';

interface AIStoryboardV2PanelProps {
  project: ProjectState;
  editor: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

export const AIStoryboardV2Panel: React.FC<AIStoryboardV2PanelProps> = ({
  project,
  editor,
  dispatch
}) => {
  const scenes: StoryboardSceneV2[] = project.storyboardScenes || [];
  const [activeSceneId, setActiveSceneId] = useState<string>(scenes[0]?.id || '');
  const [isBuilding, setIsBuilding] = useState(false);
  const [generatingSceneId, setGeneratingSceneId] = useState<string | null>(null);

  const provider = GenerativeMediaProvider.getInstance();

  const handleBuildTimeline = (level: 'light' | 'standard' | 'full' = 'standard') => {
    setIsBuilding(true);
    setTimeout(() => {
      dispatch({
        type: 'AUTO_BUILD_TIMELINE',
        payload: { scenes, level }
      });
      setIsBuilding(false);
    }, 400);
  };

  const handleRegenerateSceneMedia = async (scene: StoryboardSceneV2) => {
    setGeneratingSceneId(scene.id);
    const asset = await provider.generateImage({
      prompt: `${scene.visualDescription} cinematic 8k studio shot`,
      aspectRatio: '16:9',
      style: 'Cinematic High Contrast',
      quality: 'balanced'
    });

    dispatch({ type: 'ADD_GENERATED_ASSET', payload: asset });
    dispatch({
      type: 'UPDATE_STORYBOARD_SCENE',
      payload: {
        id: scene.id,
        updates: {
          thumbnailUrl: asset.assetUrl,
          status: 'ready'
        }
      }
    });
    setGeneratingSceneId(null);
  };

  const handleAddScene = () => {
    const lastScene = scenes[scenes.length - 1];
    const startSec = lastScene ? lastScene.endSec : 0;
    const endSec = startSec + 4;
    const newScene: StoryboardSceneV2 = {
      id: `sc_${generateId()}`,
      sceneNumber: scenes.length + 1,
      startSec,
      endSec,
      phase: 'Feature',
      title: `Feature Reveal ${scenes.length + 1}`,
      visualDescription: 'Detailed macro view highlighting precision crafted hardware ergonomics.',
      cameraDirection: 'Slow orbit right with shallow depth of field',
      voiceover: 'Crafted without compromises.',
      onScreenText: 'ENGINEERED PERFECTION',
      brollPrompt: 'Titanium chassis anodizing process in cleanroom',
      musicDirection: 'Dynamic rising arpeggio',
      transition: 'slide',
      thumbnailUrl: '',
      status: 'ready'
    };

    dispatch({
      type: 'SET_STORYBOARD_SCENES',
      payload: [...scenes, newScene]
    });
    setActiveSceneId(newScene.id);
  };

  const handleDeleteScene = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = scenes.filter((s) => s.id !== id);
    dispatch({ type: 'SET_STORYBOARD_SCENES', payload: updated });
    if (activeSceneId === id && updated[0]) {
      setActiveSceneId(updated[0].id);
    }
  };

  const phaseColors: Record<string, string> = {
    Hook: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    Feature: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Experience: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    CTA: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  };

  return (
    <div className="flex flex-col h-full overflow-hidden text-neutral-200">
      {/* Top Action Bar */}
      <div className="p-4 bg-neutral-900 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <Film size={16} className="text-blue-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              AI Storyboard & Sequence Plan V2
            </h2>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Deterministic narrative structure. Every scene maps directly to an editable timeline sequence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddScene}
            className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 border border-neutral-700"
          >
            <Plus size={14} />
            <span>Add Scene</span>
          </button>

          <button
            onClick={() => handleBuildTimeline('standard')}
            disabled={isBuilding || scenes.length === 0}
            className="text-xs bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold px-4 py-1.5 rounded-lg shadow-lg shadow-emerald-900/30 flex items-center gap-1.5 transition disabled:opacity-50"
          >
            {isBuilding ? <RotateCcw size={14} className="animate-spin" /> : <Layers size={14} />}
            <span>Build Timeline Sequence</span>
          </button>
        </div>
      </div>

      {/* Main Content: Storyboard Scenes Grid & Detail Panel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
          {scenes.map((scene) => {
            const isSelected = activeSceneId === scene.id;
            const isGenerating = generatingSceneId === scene.id;

            return (
              <div
                key={scene.id}
                onClick={() => setActiveSceneId(scene.id)}
                className={`relative bg-neutral-900/90 rounded-xl border p-3.5 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-500 ring-1 ring-blue-500/50 shadow-lg shadow-blue-500/10'
                    : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* Scene Header */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700">
                        SCENE 0{scene.sceneNumber}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                          phaseColors[scene.phase] || 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {scene.phase}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono text-neutral-400">
                        {scene.startSec}s - {scene.endSec}s
                      </span>
                      <button
                        onClick={(e) => handleDeleteScene(scene.id, e)}
                        className="text-neutral-500 hover:text-rose-400 p-1 rounded transition"
                        title="Delete Scene"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail & Visual Preview */}
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-950 border border-neutral-800 mb-2.5 flex items-center justify-center group">
                    {scene.thumbnailUrl ? (
                      <img
                        src={scene.thumbnailUrl}
                        alt={scene.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="p-3 text-center">
                        <Video size={20} className="mx-auto text-neutral-600 mb-1" />
                        <span className="text-[10px] text-neutral-500 line-clamp-2">
                          {scene.visualDescription}
                        </span>
                      </div>
                    )}

                    {/* Floating Generate button */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegenerateSceneMedia(scene);
                        }}
                        disabled={isGenerating}
                        className="text-[10px] font-bold bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded-md shadow flex items-center gap-1"
                      >
                        {isGenerating ? <RotateCcw size={11} className="animate-spin" /> : <Sparkles size={11} />}
                        <span>{isGenerating ? 'Rendering...' : 'Gen Media'}</span>
                      </button>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-white mb-1 line-clamp-1">{scene.title}</h4>
                  <p className="text-[11px] text-neutral-400 line-clamp-2 mb-2">
                    {scene.visualDescription}
                  </p>
                </div>

                {/* Key metadata icons */}
                <div className="pt-2 border-t border-neutral-800/80 space-y-1 text-[10px] text-neutral-400">
                  <div className="flex items-center gap-1 text-neutral-300 truncate">
                    <Camera size={11} className="text-blue-400 shrink-0" />
                    <span className="truncate">{scene.cameraDirection}</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-300 truncate">
                    <Volume2 size={11} className="text-emerald-400 shrink-0" />
                    <span className="truncate">"{scene.voiceover}"</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-300 truncate">
                    <Type size={11} className="text-amber-400 shrink-0" />
                    <span className="truncate">{scene.onScreenText}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Scene Detailed Editor */}
        {activeSceneId && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mt-4">
            {(() => {
              const current = scenes.find((s) => s.id === activeSceneId);
              if (!current) return null;

              return (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-400">
                        Editing Scene {current.sceneNumber}: {current.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRegenerateSceneMedia(current)}
                        className="text-xs font-semibold bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 px-3 py-1 rounded-lg transition flex items-center gap-1.5"
                      >
                        <Sparkles size={12} />
                        <span>Regenerate Media (15 Cr)</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
                        Scene Title & Phase
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={current.title}
                          onChange={(e) =>
                            dispatch({
                              type: 'UPDATE_STORYBOARD_SCENE',
                              payload: { id: current.id, updates: { title: e.target.value } }
                            })
                          }
                          className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-white text-xs outline-none focus:border-blue-500"
                        />
                        <select
                          value={current.phase}
                          onChange={(e) =>
                            dispatch({
                              type: 'UPDATE_STORYBOARD_SCENE',
                              payload: { id: current.id, updates: { phase: e.target.value as any } }
                            })
                          }
                          className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-white text-xs outline-none"
                        >
                          <option value="Hook">Hook</option>
                          <option value="Feature">Feature</option>
                          <option value="Experience">Experience</option>
                          <option value="CTA">CTA</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
                        Timing (Start & End Sec)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.5"
                          value={current.startSec}
                          onChange={(e) =>
                            dispatch({
                              type: 'UPDATE_STORYBOARD_SCENE',
                              payload: { id: current.id, updates: { startSec: Number(e.target.value) } }
                            })
                          }
                          className="w-20 bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-white text-xs outline-none text-center"
                        />
                        <span className="text-neutral-500 text-xs">to</span>
                        <input
                          type="number"
                          step="0.5"
                          value={current.endSec}
                          onChange={(e) =>
                            dispatch({
                              type: 'UPDATE_STORYBOARD_SCENE',
                              payload: { id: current.id, updates: { endSec: Number(e.target.value) } }
                            })
                          }
                          className="w-20 bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-white text-xs outline-none text-center"
                        />
                        <span className="text-neutral-500 text-xs">sec</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
                        Transition to Next
                      </label>
                      <select
                        value={current.transition}
                        onChange={(e) =>
                          dispatch({
                            type: 'UPDATE_STORYBOARD_SCENE',
                            payload: { id: current.id, updates: { transition: e.target.value as any } }
                          })
                        }
                        className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-white text-xs outline-none focus:border-blue-500"
                      >
                        <option value="cut">Cut (Instant)</option>
                        <option value="slide">Kinetic Slide</option>
                        <option value="zoom">Dynamic Zoom</option>
                        <option value="fade">Dissolve Fade</option>
                        <option value="whoosh">Whoosh Warp</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
                        Visual & Camera Direction Prompt
                      </label>
                      <textarea
                        rows={2}
                        value={current.visualDescription}
                        onChange={(e) =>
                          dispatch({
                            type: 'UPDATE_STORYBOARD_SCENE',
                            payload: { id: current.id, updates: { visualDescription: e.target.value } }
                          })
                        }
                        className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white text-xs outline-none focus:border-blue-500 resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
                        Camera Motion
                      </label>
                      <input
                        type="text"
                        value={current.cameraDirection}
                        onChange={(e) =>
                          dispatch({
                            type: 'UPDATE_STORYBOARD_SCENE',
                            payload: { id: current.id, updates: { cameraDirection: e.target.value } }
                          })
                        }
                        className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-white text-xs outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
                        Spoken Voiceover Line
                      </label>
                      <input
                        type="text"
                        value={current.voiceover}
                        onChange={(e) =>
                          dispatch({
                            type: 'UPDATE_STORYBOARD_SCENE',
                            payload: { id: current.id, updates: { voiceover: e.target.value } }
                          })
                        }
                        className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-white text-xs outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
                        On-Screen Kinetic Typography
                      </label>
                      <input
                        type="text"
                        value={current.onScreenText}
                        onChange={(e) =>
                          dispatch({
                            type: 'UPDATE_STORYBOARD_SCENE',
                            payload: { id: current.id, updates: { onScreenText: e.target.value } }
                          })
                        }
                        className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-white text-xs outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
                        B-Roll Generation Prompt
                      </label>
                      <input
                        type="text"
                        value={current.brollPrompt}
                        onChange={(e) =>
                          dispatch({
                            type: 'UPDATE_STORYBOARD_SCENE',
                            payload: { id: current.id, updates: { brollPrompt: e.target.value } }
                          })
                        }
                        className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-white text-xs outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
