import React from 'react';
import {
  Sliders,
  Trash2,
  Copy,
  MousePointer2,
  Type,
  Maximize2,
  Sparkles,
  RotateCcw,
  Palette,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key
} from 'lucide-react';
import { ProjectState, EditorState, EditorAction, Layer } from '../types';

interface PropertiesPanelProps {
  project: ProjectState;
  editor: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  isMobile: boolean;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  project,
  editor,
  dispatch,
  isMobile
}) => {
  const selectedLayer = project.layers.find((l) => l.id === editor.selectedLayerIds[0]);

  if (!selectedLayer) {
    return (
      <div
        id="properties-empty-state"
        className="w-full h-full bg-neutral-950 flex flex-col items-center justify-center text-neutral-500 p-6 text-center select-none"
      >
        <MousePointer2 size={32} className="mb-3 opacity-40 text-neutral-400" />
        <p className="text-sm font-medium text-neutral-300">No layer selected</p>
        <p className="text-xs text-neutral-500 mt-1 max-w-[200px]">
          Click on any element in the canvas or timeline to edit its properties and keyframes.
        </p>
      </div>
    );
  }

  const handlePropChange = (prop: string, value: any, isEffect: boolean = false) => {
    dispatch({
      type: 'COMMIT_PROPERTY',
      payload: {
        id: selectedLayer.id,
        prop,
        value,
        time: editor.currentTime,
        isAutoKeyframe: editor.autoKeyframe && !isEffect,
        isEffect
      }
    });
  };

  const handleClearAnimation = (prop: string) => {
    dispatch({
      type: 'CLEAR_ANIMATIONS',
      payload: { id: selectedLayer.id, prop }
    });
  };

  const activeAnimationProps = Object.keys(selectedLayer.animations || {});

  return (
    <div
      id="properties-panel"
      className="w-full h-full bg-neutral-950 flex flex-col overflow-y-auto custom-scrollbar text-neutral-200"
    >
      {/* Header */}
      {!isMobile && (
        <div className="p-3.5 border-b border-neutral-800 flex items-center justify-between text-white font-medium sticky top-0 bg-neutral-950/95 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <Sliders size={15} className="text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Properties
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => dispatch({ type: 'DUPLICATE_LAYER', payload: selectedLayer.id })}
              className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
              title="Duplicate Layer"
            >
              <Copy size={14} />
            </button>
            <button
              onClick={() => dispatch({ type: 'DELETE_LAYER', payload: selectedLayer.id })}
              className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-red-400 transition"
              title="Delete Layer"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="p-4 flex flex-col gap-5 pb-20">
        {/* Layer Identity Section */}
        <div className="flex flex-col gap-2 bg-neutral-900/40 p-3 rounded-lg border border-neutral-800/80">
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={selectedLayer.name}
              onChange={(e) => handlePropChange('name', e.target.value)}
              className="bg-transparent font-bold text-sm text-white focus:bg-neutral-900 px-1 py-0.5 rounded border border-transparent focus:border-neutral-700 outline-none w-full"
            />
            <span className="text-[10px] font-mono uppercase bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded ml-2 shrink-0">
              {selectedLayer.type}
            </span>
          </div>
        </div>

        {/* Text Layer Specific Content */}
        {selectedLayer.type === 'text' && (
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
              <Type size={12} /> Text Content
            </h4>
            <div className="flex flex-col gap-2">
              <textarea
                value={selectedLayer.text ?? ''}
                onChange={(e) => handlePropChange('text', e.target.value)}
                rows={2}
                className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-xs text-white focus:border-blue-500 outline-none resize-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-neutral-400">Font Size</label>
                  <input
                    type="number"
                    value={selectedLayer.baseProps.fontSize || 80}
                    onChange={(e) => handlePropChange('fontSize', Number(e.target.value))}
                    className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs text-white focus:border-blue-500 outline-none font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-neutral-400">Weight</label>
                  <select
                    value={selectedLayer.baseProps.fontWeight || '700'}
                    onChange={(e) => handlePropChange('fontWeight', e.target.value)}
                    className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs text-white focus:border-blue-500 outline-none"
                  >
                    <option value="400">Regular (400)</option>
                    <option value="600">Semi-Bold (600)</option>
                    <option value="800">Bold (800)</option>
                    <option value="900">Black (900)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transform Group */}
        <div>
          <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Transform</span>
            {editor.autoKeyframe && (
              <span className="text-[9px] text-blue-400 flex items-center gap-0.5">
                <Key size={10} /> Auto-Keying
              </span>
            )}
          </h4>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: 'Position X', prop: 'x', step: '1' },
              { label: 'Position Y', prop: 'y', step: '1' },
              { label: 'Scale', prop: 'scale', step: '0.05' },
              { label: 'Rotation (°)', prop: 'rotation', step: '1' }
            ].map((f) => (
              <div key={f.prop} className="flex flex-col gap-1 bg-neutral-900/60 p-2 rounded border border-neutral-800">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-neutral-400 uppercase font-medium">
                    {f.label}
                  </label>
                  {selectedLayer.animations[f.prop] && selectedLayer.animations[f.prop].length > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-xs shadow-blue-400" title="Keyframed property" />
                  )}
                </div>
                <input
                  type="number"
                  step={f.step}
                  value={Number(selectedLayer.baseProps[f.prop] ?? (f.prop === 'scale' ? 1 : 0))}
                  onChange={(e) => handlePropChange(f.prop, Number(e.target.value))}
                  className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-xs text-white focus:border-blue-500 outline-none font-mono"
                />
              </div>
            ))}
          </div>

          {/* Size (for Rect & Circle) */}
          {selectedLayer.type !== 'text' && (
            <div className="grid grid-cols-2 gap-2.5 mt-2.5">
              <div className="flex flex-col gap-1 bg-neutral-900/60 p-2 rounded border border-neutral-800">
                <label className="text-[10px] text-neutral-400 uppercase font-medium">Width</label>
                <input
                  type="number"
                  value={selectedLayer.baseProps.width || 400}
                  onChange={(e) => handlePropChange('width', Number(e.target.value))}
                  className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-xs text-white focus:border-blue-500 outline-none font-mono"
                />
              </div>
              <div className="flex flex-col gap-1 bg-neutral-900/60 p-2 rounded border border-neutral-800">
                <label className="text-[10px] text-neutral-400 uppercase font-medium">Height</label>
                <input
                  type="number"
                  value={selectedLayer.baseProps.height || 400}
                  onChange={(e) => handlePropChange('height', Number(e.target.value))}
                  className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-xs text-white focus:border-blue-500 outline-none font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Fill & Styling */}
        <div>
          <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Palette size={12} /> Appearance
          </h4>
          <div className="flex flex-col gap-2.5 bg-neutral-900/50 border border-neutral-800 p-3 rounded-lg">
            {/* Color Swatch / Picker */}
            <div className="flex items-center justify-between">
              <label className="text-xs text-neutral-400">Fill Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedLayer.baseProps.fill === 'transparent' ? '#000000' : selectedLayer.baseProps.fill || '#ffffff'}
                  onChange={(e) => handlePropChange('fill', e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border border-neutral-700 bg-transparent"
                />
                <input
                  type="text"
                  value={selectedLayer.baseProps.fill || ''}
                  onChange={(e) => handlePropChange('fill', e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 rounded px-2 py-0.5 text-xs text-white font-mono w-24 text-center"
                />
              </div>
            </div>

            {/* Quick Palettes */}
            <div className="flex items-center gap-1.5 pt-1">
              {['#ffffff', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', 'transparent'].map((color) => (
                <button
                  key={color}
                  onClick={() => handlePropChange('fill', color)}
                  className={`w-5 h-5 rounded-full border border-neutral-700 transition hover:scale-110 ${
                    color === 'transparent' ? 'bg-neutral-800 relative after:content-[""] after:absolute after:inset-0 after:border-t after:border-red-500 after:rotate-45' : ''
                  }`}
                  style={{ backgroundColor: color === 'transparent' ? undefined : color }}
                  title={color}
                />
              ))}
            </div>

            {/* Stroke */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
              <label className="text-xs text-neutral-400">Stroke</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedLayer.baseProps.stroke || '#3b82f6'}
                  onChange={(e) => handlePropChange('stroke', e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border border-neutral-700 bg-transparent"
                />
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={selectedLayer.baseProps.strokeWidth || 0}
                  onChange={(e) => handlePropChange('strokeWidth', Number(e.target.value))}
                  className="bg-neutral-950 border border-neutral-800 rounded px-2 py-0.5 text-xs text-white font-mono w-14 text-center"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Effects Stack */}
        <div>
          <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2.5">
            Effects Stack
          </h4>
          <div className="flex flex-col gap-3.5 bg-neutral-900/50 border border-neutral-800 p-3 rounded-lg">
            {/* Opacity */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-neutral-400">
                <span>Opacity</span>
                <span className="font-mono text-neutral-300">
                  {Math.round((selectedLayer.baseProps.opacity ?? 1) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={selectedLayer.baseProps.opacity ?? 1}
                onChange={(e) => handlePropChange('opacity', Number(e.target.value))}
                className="accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Motion Blur */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-neutral-400">
                <span>Motion Blur</span>
                <span className="font-mono text-neutral-300">
                  {selectedLayer.effects?.blur || 0}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={selectedLayer.effects?.blur || 0}
                onChange={(e) => handlePropChange('blur', Number(e.target.value), true)}
                className="accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Drop Shadow */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-neutral-400">
                <span>Drop Shadow</span>
                <span className="font-mono text-neutral-300">
                  {selectedLayer.effects?.shadow || 0}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="1"
                value={selectedLayer.effects?.shadow || 0}
                onChange={(e) => handlePropChange('shadow', Number(e.target.value), true)}
                className="accent-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Active Keyframe Tracks */}
        {activeAnimationProps.length > 0 && (
          <div>
            <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2.5">
              Active Animation Tracks
            </h4>
            <div className="flex flex-col gap-1.5">
              {activeAnimationProps.map((prop) => {
                const kfs = selectedLayer.animations[prop];
                return (
                  <div
                    key={prop}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded bg-neutral-900/60 border border-neutral-800 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rotate-45 bg-purple-400" />
                      <span className="font-medium text-neutral-300 capitalize">{prop}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        ({kfs.length} kfs)
                      </span>
                    </div>
                    <button
                      onClick={() => handleClearAnimation(prop)}
                      className="text-neutral-500 hover:text-red-400 text-[11px] transition"
                      title="Clear track"
                    >
                      Clear
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
