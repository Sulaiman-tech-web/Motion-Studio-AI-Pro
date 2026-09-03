import React, { useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  Music,
  Zap
} from 'lucide-react';
import { ProjectState, EditorState, EditorAction } from '../types';
import { formatTime } from '../utils/animation';

interface TimelineProps {
  project: ProjectState;
  editor: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  setDragState: React.Dispatch<React.SetStateAction<any>>;
}

export const Timeline: React.FC<TimelineProps> = ({
  project,
  editor,
  dispatch,
  setDragState
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);

  const handleTimelinePointerDown = (e: React.PointerEvent) => {
    if (!timelineRef.current) return;
    setDragState({ type: 'playhead', container: timelineRef.current });

    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    dispatch({ type: 'SET_TIME', payload: Number((percentage * project.duration).toFixed(3)) });
  };

  const handleStepFrame = (frames: number) => {
    const frameDuration = 1 / project.fps;
    const newTime = Math.max(0, Math.min(project.duration, editor.currentTime + frames * frameDuration));
    dispatch({ type: 'SET_TIME', payload: Number(newTime.toFixed(3)) });
  };

  const handleAddKeyframeAtPlayhead = () => {
    const selectedLayer = project.layers.find((l) => l.id === editor.selectedLayerIds[0]);
    if (!selectedLayer) return;

    ['x', 'y', 'scale', 'rotation', 'opacity'].forEach((prop) => {
      const val = selectedLayer.baseProps[prop] ?? (prop === 'scale' || prop === 'opacity' ? 1 : 0);
      dispatch({
        type: 'COMMIT_PROPERTY',
        payload: {
          id: selectedLayer.id,
          prop,
          value: val,
          time: editor.currentTime,
          isAutoKeyframe: true
        }
      });
    });
  };

  // Sub-frame timecode: mm:ss:ff (frames)
  const currentFrame = Math.floor(editor.currentTime * project.fps);
  const totalFrames = Math.floor(project.duration * project.fps);
  const currentSec = Math.floor(editor.currentTime);
  const frameOfSec = currentFrame % project.fps;
  const timecodeFormatted = `${String(Math.floor(currentSec / 60)).padStart(2, '0')}:${String(
    currentSec % 60
  ).padStart(2, '0')}:${String(frameOfSec).padStart(2, '0')}`;

  // Beat markers if beat sync enabled
  const beatInterval = 60 / (editor.beatSync?.bpm || 128);
  const beatMarkersCount = Math.floor(project.duration / beatInterval);

  return (
    <div
      id="timeline-panel"
      className="h-64 bg-neutral-950 border-t border-neutral-800 flex flex-col shrink-0 select-none"
    >
      {/* Timeline Controls Header */}
      <div className="h-10 border-b border-neutral-800 flex items-center px-4 justify-between bg-neutral-900/90 shrink-0">
        <div className="flex items-center gap-2">
          {/* Jump to start */}
          <button
            onClick={() => dispatch({ type: 'SET_TIME', payload: 0 })}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            title="Jump to Start (0s)"
          >
            <SkipBack size={14} />
          </button>

          {/* Previous Frame */}
          <button
            onClick={() => handleStepFrame(-1)}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            title="Step Back 1 Frame"
          >
            <ChevronLeft size={15} />
          </button>

          {/* Play/Pause */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_PLAY' })}
            className="w-7 h-7 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded shadow transition"
            title={editor.isPlaying ? 'Pause' : 'Play'}
          >
            {editor.isPlaying ? (
              <Pause size={13} fill="currentColor" />
            ) : (
              <Play size={13} fill="currentColor" className="ml-0.5" />
            )}
          </button>

          {/* Next Frame */}
          <button
            onClick={() => handleStepFrame(1)}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            title="Step Forward 1 Frame"
          >
            <ChevronRight size={15} />
          </button>

          {/* Jump to end */}
          <button
            onClick={() => dispatch({ type: 'SET_TIME', payload: project.duration })}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            title="Jump to End"
          >
            <SkipForward size={14} />
          </button>

          {/* Timecode Badge (Sub-Frame Accurate) */}
          <div className="text-neutral-200 font-mono text-xs ml-3 font-bold bg-neutral-950 px-2.5 py-1 rounded border border-neutral-800 flex items-center gap-1.5">
            <span className="text-blue-400">{timecodeFormatted}</span>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-500">{formatTime(project.duration)}</span>
          </div>

          {/* Beat sync active indicator */}
          {editor.beatSync?.enabled && (
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              <Music size={11} />
              <span>{editor.beatSync.bpm} BPM</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {/* Add Keyframe button */}
          <button
            onClick={handleAddKeyframeAtPlayhead}
            disabled={editor.selectedLayerIds.length === 0}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-xs text-neutral-300 transition"
            title="Record keyframe for selected layer"
          >
            <Key size={12} className="text-amber-400" />
            <span className="hidden sm:inline">Add Keyframe</span>
          </button>

          <span className="text-[11px] text-neutral-500 font-mono">
            Frame: <span className="text-neutral-300 font-bold">{currentFrame}</span> / {totalFrames} ({project.fps}fps)
          </span>
        </div>
      </div>

      {/* Timeline Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Track Headers */}
        <div className="w-56 border-r border-neutral-800 bg-neutral-950 overflow-y-auto hidden-scrollbar z-10 shrink-0">
          <div className="h-6 border-b border-neutral-800 bg-neutral-900/60 flex items-center px-3 text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
            Layer Track
          </div>

          {project.layers.map((layer) => {
            const isSelected = editor.selectedLayerIds.includes(layer.id);
            return (
              <div
                key={`header-${layer.id}`}
                onClick={() => dispatch({ type: 'SELECT_LAYER', payload: layer.id })}
                className={`h-12 border-b border-neutral-800 flex items-center justify-between px-3 cursor-pointer transition ${
                  isSelected
                    ? 'bg-blue-950/40 text-blue-300 border-l-2 border-l-blue-500'
                    : 'text-neutral-400 hover:bg-neutral-900/60 border-l-2 border-l-transparent'
                }`}
              >
                <div className="flex flex-col truncate pr-2">
                  <span className="text-xs font-semibold truncate text-neutral-200">
                    {layer.name}
                  </span>
                  <span className="text-[9px] text-neutral-500 uppercase font-mono">
                    {layer.type}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({ type: 'TOGGLE_LAYER_VISIBILITY', payload: layer.id });
                    }}
                    className={`p-1 rounded hover:bg-neutral-800 transition ${
                      layer.visible === false
                        ? 'text-neutral-600'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                    title={layer.visible === false ? 'Unhide Layer' : 'Hide Layer'}
                  >
                    {layer.visible === false ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Timeline Lanes & Scrub Ruler */}
        <div
          className="flex-1 relative bg-neutral-900/50 overflow-hidden cursor-ew-resize select-none"
          ref={timelineRef}
          onPointerDown={handleTimelinePointerDown}
        >
          {/* Time Marks & Beat Ruler */}
          <div className="h-6 border-b border-neutral-800 bg-neutral-950 flex relative text-[10px] text-neutral-500 pointer-events-none font-mono">
            {/* Seconds marks */}
            {[...Array(Math.floor(project.duration) + 1)].map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 border-l border-neutral-800 flex flex-col justify-end pb-0.5 px-1.5"
                style={{ left: `${(i / project.duration) * 100}%` }}
              >
                <span>{i}s</span>
              </div>
            ))}

            {/* Beat Sync markers (small ticks) */}
            {editor.beatSync?.enabled &&
              [...Array(beatMarkersCount)].map((_, bIdx) => {
                const beatTime = (bIdx + 1) * beatInterval;
                if (beatTime >= project.duration) return null;
                return (
                  <div
                    key={`beat-${bIdx}`}
                    className="absolute top-0 h-2 border-l border-purple-500/50"
                    style={{ left: `${(beatTime / project.duration) * 100}%` }}
                  />
                );
              })}
          </div>

          {/* Tracks Lanes */}
          <div className="absolute inset-0 top-6 overflow-y-auto hidden-scrollbar pointer-events-none">
            <div className="flex flex-col relative min-h-full">
              {project.layers.map((layer) => {
                const isSelected = editor.selectedLayerIds.includes(layer.id);
                return (
                  <div
                    key={`track-${layer.id}`}
                    className={`h-12 border-b border-neutral-800/60 relative ${
                      isSelected ? 'bg-blue-950/20' : 'bg-neutral-900/20'
                    }`}
                  >
                    {/* Active Track Duration Bar */}
                    <div className="absolute top-3.5 bottom-3.5 left-0 right-0 bg-neutral-800/40 rounded mx-1 border border-neutral-700/40" />

                    {/* Keyframe Diamonds */}
                    {Object.entries(layer.animations).map(([prop, keyframes]) =>
                      Array.isArray(keyframes)
                        ? keyframes.map((kf, i) => {
                            const isCurved = kf.easing && kf.easing !== 'linear';
                            const leftPct = (kf.time / project.duration) * 100;

                            return (
                              <div
                                key={`${prop}-${i}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch({ type: 'SET_TIME', payload: kf.time });
                                  dispatch({ type: 'SELECT_LAYER', payload: layer.id });
                                }}
                                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border z-10 cursor-pointer pointer-events-auto transition-transform hover:scale-125 shadow-md"
                                style={{
                                  left: `calc(${leftPct}% - 6px)`,
                                  backgroundColor: isCurved ? '#a855f7' : '#3b82f6',
                                  borderColor: isCurved ? '#e9d5ff' : '#bfdbfe'
                                }}
                                title={`${prop}: ${kf.value} @ ${kf.time.toFixed(2)}s (${kf.easing || 'easeOutQuad'})`}
                              />
                            );
                          })
                        : null
                    )}
                  </div>
                );
              })}
            </div>

            {/* Playhead Needle (Red Vertical Line) */}
            <div
              className="absolute top-0 bottom-0 w-px bg-red-500 z-20 pointer-events-none transition-none shadow-[0_0_8px_rgba(239,68,68,0.8)]"
              style={{ left: `${(editor.currentTime / project.duration) * 100}%` }}
            >
              <div className="w-3.5 h-3.5 bg-red-500 rotate-45 absolute -top-1.5 -left-[6px] rounded-xs shadow-md border border-red-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
