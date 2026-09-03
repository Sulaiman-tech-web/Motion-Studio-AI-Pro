import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  Key,
  Undo2,
  Redo2,
  Pause,
  MonitorPlay,
  Download,
  Plus,
  Type,
  Square,
  Circle,
  Coins,
  Wand2,
  Film,
  Sliders,
  Palette,
  Volume2,
  Subtitles,
  Layers
} from 'lucide-react';
import { ProjectState, EditorState, EditorAction, Layer, WorkspaceMode } from '../types';
import { generateId } from '../utils/animation';

interface TopBarProps {
  project: ProjectState;
  editor: EditorState;
  isMobile: boolean;
  canUndo: boolean;
  canRedo: boolean;
  dispatch: React.Dispatch<EditorAction>;
}

export const TopBar: React.FC<TopBarProps> = ({
  project,
  editor,
  isMobile,
  canUndo,
  canRedo,
  dispatch
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(project.name);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const handleNameSubmit = () => {
    if (nameInput.trim()) {
      dispatch({ type: 'UPDATE_PROJECT_NAME', payload: nameInput.trim() });
    } else {
      setNameInput(project.name);
    }
    setIsEditingName(false);
  };

  const is4K = project.resolution.w >= 3840 || project.resolution.h >= 3840;
  const is1440p = !is4K && (project.resolution.w >= 2560 || project.resolution.h >= 2560);
  const isHighFps = project.fps >= 60;

  const currentMode: WorkspaceMode = editor.workspaceMode || 'CREATE';

  const workspaceModes: { id: WorkspaceMode; label: string; icon: React.ComponentType<any> }[] = [
    { id: 'CREATE', label: 'CREATE V6', icon: Sparkles },
    { id: 'VIDEO', label: 'VIDEO', icon: Film },
    { id: 'MOTION', label: 'MOTION', icon: Wand2 },
    { id: 'COLOR', label: 'COLOR', icon: Palette },
    { id: 'AUDIO', label: 'AUDIO', icon: Volume2 },
    { id: 'CAPTIONS', label: 'CAPTIONS', icon: Subtitles }
  ];

  const handleAddText = () => {
    const newLayer: Layer = {
      id: `txt_${generateId()}`,
      name: `Text ${project.layers.length + 1}`,
      type: 'text',
      text: 'AI MOTION PRO',
      baseProps: {
        x: project.resolution.w / 2,
        y: project.resolution.h / 2,
        width: 600,
        height: 120,
        fill: '#ffffff',
        fontSize: Math.round(project.resolution.h * 0.08),
        fontWeight: '900',
        opacity: 1,
        rotation: 0,
        scale: 1
      },
      effects: { blur: 0, shadow: 15, glow: 10 },
      animations: {
        scale: [
          { time: editor.currentTime, value: 0.2, easing: 'easeOutBack' },
          { time: Math.min(project.duration, editor.currentTime + 1), value: 1 }
        ],
        opacity: [
          { time: editor.currentTime, value: 0, easing: 'linear' },
          { time: Math.min(project.duration, editor.currentTime + 0.6), value: 1 }
        ]
      }
    };
    dispatch({ type: 'ADD_LAYER', payload: newLayer });
    setShowAddMenu(false);
  };

  const handleAddRect = () => {
    const newLayer: Layer = {
      id: `rect_${generateId()}`,
      name: `Box ${project.layers.length + 1}`,
      type: 'rect',
      baseProps: {
        x: project.resolution.w / 2,
        y: project.resolution.h / 2,
        width: Math.round(project.resolution.w * 0.25),
        height: Math.round(project.resolution.w * 0.25),
        fill: '#3b82f6',
        stroke: '#60a5fa',
        strokeWidth: 2,
        borderRadius: '20px',
        opacity: 1,
        rotation: 0,
        scale: 1
      },
      effects: { blur: 0, shadow: 20, glow: 15 },
      animations: {
        scale: [
          { time: editor.currentTime, value: 0, easing: 'easeOutBack' },
          { time: Math.min(project.duration, editor.currentTime + 1), value: 1 }
        ]
      }
    };
    dispatch({ type: 'ADD_LAYER', payload: newLayer });
    setShowAddMenu(false);
  };

  const handleAddCircle = () => {
    const newLayer: Layer = {
      id: `shape_${generateId()}`,
      name: `Ring ${project.layers.length + 1}`,
      type: 'circle',
      baseProps: {
        x: project.resolution.w / 2,
        y: project.resolution.h / 2,
        width: Math.round(project.resolution.w * 0.35),
        height: Math.round(project.resolution.w * 0.35),
        fill: 'transparent',
        stroke: '#ec4899',
        strokeWidth: 4,
        borderRadius: '50%',
        opacity: 1,
        rotation: 0,
        scale: 1
      },
      effects: { blur: 0, shadow: 10, glow: 25 },
      animations: {
        rotation: [
          { time: 0, value: 0, easing: 'linear' },
          { time: project.duration, value: 360 }
        ]
      }
    };
    dispatch({ type: 'ADD_LAYER', payload: newLayer });
    setShowAddMenu(false);
  };

  return (
    <header
      id="top-bar"
      className="h-14 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between px-3 md:px-5 shrink-0 z-20 text-neutral-200"
    >
      {/* Brand & Project Identity */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-900/40 shrink-0">
          <Sparkles size={16} className="text-white" />
        </div>
        {!isMobile && (
          <div className="font-semibold tracking-wide flex items-center gap-1.5 text-sm text-neutral-100">
            <span>MOTION STUDIO AI</span>
            <span className="px-1.5 py-0.5 rounded bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-mono font-bold shadow-sm">
              PRO V6
            </span>
          </div>
        )}

        <div className="h-4 w-px bg-neutral-800 hidden sm:block mx-0.5" />

        {/* Project Name Editor */}
        <div className="flex items-center">
          {isEditingName ? (
            <input
              type="text"
              value={nameInput}
              autoFocus
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
              className="bg-neutral-900 border border-blue-500 rounded px-2 py-0.5 text-xs text-white outline-none"
            />
          ) : (
            <button
              onClick={() => {
                setNameInput(project.name);
                setIsEditingName(true);
              }}
              className="text-xs md:text-sm text-neutral-300 font-medium hover:text-white transition flex items-center gap-1.5 px-2 py-1 rounded hover:bg-neutral-900"
              title="Click to rename project"
            >
              <span className="truncate max-w-[110px] md:max-w-[150px]">{project.name}</span>
              <ChevronDown size={13} className="text-neutral-500" />
            </button>
          )}

          {/* Master Resolution Pill */}
          {!isMobile && (
            <div className="flex items-center gap-1.5 ml-2">
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                  is4K
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    : is1440p
                    ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                    : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                }`}
              >
                {is4K ? '4K UHD' : is1440p ? '1440p QHD' : '1080p HD'}
              </span>

              {/* High FPS badge */}
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                  project.fps >= 120
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : isHighFps
                    ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                }`}
              >
                {project.fps} FPS
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Central Workspace Mode Selector (V6 Requirement) */}
      {!isMobile && (
        <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5 gap-0.5 shadow-inner">
          {workspaceModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = currentMode === mode.id;

            return (
              <button
                key={mode.id}
                onClick={() => dispatch({ type: 'SET_WORKSPACE_MODE', payload: mode.id })}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
                }`}
              >
                <Icon size={12} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Center / Action Toolbar */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Credits Balance Pill */}
        <div
          className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-md text-xs"
          title="Available AI Render Credits"
        >
          <Coins size={13} className="text-amber-400" />
          <span className="font-mono font-bold text-amber-300">{editor.renderCredits ?? 1000}</span>
          <span className="text-[10px] text-neutral-500 uppercase hidden lg:inline">Cr</span>
        </div>

        {/* Add Layer Menu */}
        <div className="relative">
          <button
            id="btn-add-layer"
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-xs font-medium text-neutral-300 border border-neutral-800 transition hover:text-white"
            title="Add Layer"
          >
            <Plus size={14} className="text-blue-400" />
            <span className="hidden sm:inline">Add</span>
          </button>

          {showAddMenu && (
            <div
              className="absolute top-full right-0 mt-1.5 w-48 bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl py-1.5 z-50 flex flex-col"
              onMouseLeave={() => setShowAddMenu(false)}
            >
              <button
                onClick={handleAddText}
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 text-left transition"
              >
                <Type size={14} className="text-blue-400" /> Text Layer
              </button>
              <button
                onClick={handleAddRect}
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 text-left transition"
              >
                <Square size={14} className="text-indigo-400" /> Geometric Box
              </button>
              <button
                onClick={handleAddCircle}
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 text-left transition"
              >
                <Circle size={14} className="text-pink-400" /> Accent Ring
              </button>
            </div>
          )}
        </div>

        {/* Auto Keyframe Toggle */}
        <button
          id="btn-auto-keyframe"
          onClick={() => dispatch({ type: 'TOGGLE_AUTO_KEYFRAME' })}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-bold transition ${
            editor.autoKeyframe
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50 shadow-sm shadow-blue-900/20'
              : 'bg-neutral-900 text-neutral-500 border border-neutral-800 hover:bg-neutral-800'
          }`}
          title={editor.autoKeyframe ? 'Auto Keyframe Enabled' : 'Auto Keyframe Disabled'}
        >
          <Key size={13} className={editor.autoKeyframe ? 'text-blue-400' : 'text-neutral-500'} />
          <span className="hidden sm:inline">{editor.autoKeyframe ? 'AUTO ON' : 'AUTO OFF'}</span>
        </button>

        {/* Undo / Redo */}
        {!isMobile && (
          <div className="flex items-center gap-0.5 bg-neutral-900 border border-neutral-800 rounded-md p-0.5">
            <button
              id="btn-undo"
              onClick={() => dispatch({ type: 'UNDO' })}
              disabled={!canUndo}
              className="p-1.5 rounded hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition text-neutral-300"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={14} />
            </button>
            <button
              id="btn-redo"
              onClick={() => dispatch({ type: 'REDO' })}
              disabled={!canRedo}
              className="p-1.5 rounded hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition text-neutral-300"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={14} />
            </button>
          </div>
        )}

        {/* Preview Play/Pause */}
        <button
          id="btn-toggle-play"
          onClick={() => dispatch({ type: 'TOGGLE_PLAY' })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition border ${
            editor.isPlaying
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-800'
          }`}
          title={editor.isPlaying ? 'Pause Preview (Space)' : 'Play Preview (Space)'}
        >
          {editor.isPlaying ? <Pause size={14} /> : <MonitorPlay size={14} />}
          {!isMobile && (editor.isPlaying ? 'Pause' : 'Preview')}
        </button>

        {/* Export Button */}
        <button
          id="btn-export-dialog"
          onClick={() => dispatch({ type: 'TOGGLE_EXPORT', payload: true })}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-white text-black hover:bg-neutral-200 text-xs font-bold transition shadow-sm"
          title="Export Video / Master 4K / 120 FPS"
        >
          <Download size={14} />
          <span>Export V6</span>
        </button>
      </div>
    </header>
  );
};
