import React from 'react';
import {
  Layers,
  Type,
  Square,
  Circle,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Plus
} from 'lucide-react';
import { ProjectState, EditorState, EditorAction, Layer } from '../types';
import { generateId } from '../utils/animation';

interface LayersPanelProps {
  project: ProjectState;
  editor: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({ project, editor, dispatch }) => {
  const handleAddText = () => {
    const newLayer: Layer = {
      id: `txt_${generateId()}`,
      name: `Text ${project.layers.length + 1}`,
      type: 'text',
      text: 'MOTION TITLE',
      baseProps: {
        x: project.resolution.w / 2,
        y: project.resolution.h / 2,
        width: 600,
        height: 120,
        fill: '#ffffff',
        fontSize: 80,
        fontWeight: '800',
        opacity: 1,
        rotation: 0,
        scale: 1
      },
      effects: { blur: 0, shadow: 15 },
      animations: {
        scale: [
          { time: editor.currentTime, value: 0.1, easing: 'easeOutBack' },
          { time: Math.min(project.duration, editor.currentTime + 1), value: 1 }
        ]
      }
    };
    dispatch({ type: 'ADD_LAYER', payload: newLayer });
  };

  const handleAddRect = () => {
    const newLayer: Layer = {
      id: `rect_${generateId()}`,
      name: `Box ${project.layers.length + 1}`,
      type: 'rect',
      baseProps: {
        x: project.resolution.w / 2,
        y: project.resolution.h / 2,
        width: 450,
        height: 300,
        fill: '#3b82f6',
        stroke: '#93c5fd',
        strokeWidth: 2,
        borderRadius: '16px',
        opacity: 1,
        rotation: 0,
        scale: 1
      },
      effects: { blur: 0, shadow: 10 },
      animations: {}
    };
    dispatch({ type: 'ADD_LAYER', payload: newLayer });
  };

  const handleAddCircle = () => {
    const newLayer: Layer = {
      id: `shape_${generateId()}`,
      name: `Circle ${project.layers.length + 1}`,
      type: 'circle',
      baseProps: {
        x: project.resolution.w / 2,
        y: project.resolution.h / 2,
        width: 500,
        height: 500,
        fill: 'transparent',
        stroke: '#ec4899',
        strokeWidth: 4,
        borderRadius: '50%',
        opacity: 1,
        rotation: 0,
        scale: 1
      },
      effects: { blur: 0, shadow: 10 },
      animations: {
        rotation: [
          { time: 0, value: 0, easing: 'linear' },
          { time: project.duration, value: 360 }
        ]
      }
    };
    dispatch({ type: 'ADD_LAYER', payload: newLayer });
  };

  const handleMoveLayer = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index + 1 : index - 1;
    if (targetIndex < 0 || targetIndex >= project.layers.length) return;
    dispatch({
      type: 'REORDER_LAYERS',
      payload: { sourceIndex: index, targetIndex }
    });
  };

  return (
    <div id="layers-panel" className="flex flex-col gap-3 select-none">
      {/* Quick Add Buttons */}
      <div className="flex items-center gap-1.5 pb-2 border-b border-neutral-800">
        <button
          onClick={handleAddText}
          className="flex-1 py-1.5 px-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded text-xs font-medium border border-neutral-800 flex items-center justify-center gap-1.5 transition"
        >
          <Plus size={12} className="text-blue-400" />
          <span>Text</span>
        </button>
        <button
          onClick={handleAddRect}
          className="flex-1 py-1.5 px-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded text-xs font-medium border border-neutral-800 flex items-center justify-center gap-1.5 transition"
        >
          <Plus size={12} className="text-indigo-400" />
          <span>Box</span>
        </button>
        <button
          onClick={handleAddCircle}
          className="flex-1 py-1.5 px-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded text-xs font-medium border border-neutral-800 flex items-center justify-center gap-1.5 transition"
        >
          <Plus size={12} className="text-pink-400" />
          <span>Circle</span>
        </button>
      </div>

      {/* Layer Stack (Reversed display so top layer in stack is top z-index) */}
      <div className="flex flex-col gap-1.5">
        {[...project.layers].reverse().map((layer, reverseIdx) => {
          const actualIndex = project.layers.length - 1 - reverseIdx;
          const isSelected = editor.selectedLayerIds.includes(layer.id);

          return (
            <div
              key={layer.id}
              onClick={() => dispatch({ type: 'SELECT_LAYER', payload: layer.id })}
              className={`flex items-center justify-between p-2 rounded-lg text-xs transition border cursor-pointer ${
                isSelected
                  ? 'bg-blue-600/15 text-blue-300 border-blue-500/40 shadow-sm'
                  : 'text-neutral-400 hover:bg-neutral-900 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {layer.type === 'text' && <Type size={14} className="text-blue-400 shrink-0" />}
                {layer.type === 'rect' && <Square size={14} className="text-indigo-400 shrink-0" />}
                {layer.type === 'circle' && <Circle size={14} className="text-pink-400 shrink-0" />}
                <span className="font-medium truncate text-neutral-200">{layer.name}</span>
              </div>

              {/* Action icons */}
              <div className="flex items-center gap-1 shrink-0">
                {/* Reorder Up / Down */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveLayer(actualIndex, 'up');
                  }}
                  disabled={actualIndex === project.layers.length - 1}
                  className="p-1 rounded text-neutral-500 hover:text-white disabled:opacity-20 hover:bg-neutral-800 transition"
                  title="Move forward"
                >
                  <ChevronUp size={13} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveLayer(actualIndex, 'down');
                  }}
                  disabled={actualIndex === 0}
                  className="p-1 rounded text-neutral-500 hover:text-white disabled:opacity-20 hover:bg-neutral-800 transition"
                  title="Move backward"
                >
                  <ChevronDown size={13} />
                </button>

                {/* Visibility */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: 'TOGGLE_LAYER_VISIBILITY', payload: layer.id });
                  }}
                  className="p-1 rounded text-neutral-500 hover:text-white hover:bg-neutral-800 transition"
                  title={layer.visible === false ? 'Unhide' : 'Hide'}
                >
                  {layer.visible === false ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>

                {/* Duplicate */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: 'DUPLICATE_LAYER', payload: layer.id });
                  }}
                  className="p-1 rounded text-neutral-500 hover:text-white hover:bg-neutral-800 transition"
                  title="Duplicate"
                >
                  <Copy size={13} />
                </button>

                {/* Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: 'DELETE_LAYER', payload: layer.id });
                  }}
                  className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition"
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
