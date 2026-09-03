import React from 'react';
import {
  Smartphone,
  Tv,
  Square,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { ProjectState, EditorState, EditorAction, MultiFormatVariant, Resolution } from '../../types';

interface SocialVariantsPanelProps {
  project: ProjectState;
  editor: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

export const SocialVariantsPanel: React.FC<SocialVariantsPanelProps> = ({
  project,
  editor,
  dispatch
}) => {
  const variants = editor.variants || [];

  const handleApplyVariant = (v: MultiFormatVariant) => {
    const scaleX = v.resolution.w / project.resolution.w;
    const scaleY = v.resolution.h / project.resolution.h;

    dispatch({
      type: 'RESPONSIVE_RESIZE',
      payload: {
        targetResolution: v.resolution,
        scaleFactors: { scaleX, scaleY }
      }
    });
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4 text-neutral-200">
      {/* Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Smartphone size={16} className="text-blue-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              AI Multi-Format Adaptation & Social Variants
            </h2>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Intelligent spatial reflow. Automatically re-centers subject matter, repositions kinetic typography, and preserves platform safe zones.
          </p>
        </div>

        <div className="text-xs text-neutral-400">
          Current Master: <span className="font-mono text-white font-bold">{project.resolution.aspectRatio || '16:9'}</span> ({project.resolution.w}x{project.resolution.h})
        </div>
      </div>

      {/* Variants Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {variants.map((v) => {
          const isCurrent =
            project.resolution.w === v.resolution.w && project.resolution.h === v.resolution.h;

          return (
            <div
              key={v.id}
              className={`bg-neutral-900/80 border rounded-xl p-4 flex flex-col justify-between space-y-3 transition ${
                isCurrent
                  ? 'border-blue-500 ring-1 ring-blue-500/50 shadow-lg shadow-blue-500/10'
                  : 'border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">{v.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                    {v.aspectRatio}
                  </span>
                </div>

                {/* Aspect Ratio Box Preview */}
                <div className="h-28 bg-neutral-950 border border-neutral-800 rounded-lg flex items-center justify-center p-2">
                  <div
                    className="border-2 border-dashed border-blue-400/50 bg-blue-500/10 rounded flex items-center justify-center text-[10px] font-mono text-blue-300"
                    style={{
                      width: v.aspectRatio === '9:16' ? '40px' : v.aspectRatio === '1:1' ? '70px' : v.aspectRatio === '4:5' ? '56px' : '90px',
                      height: v.aspectRatio === '9:16' ? '70px' : v.aspectRatio === '1:1' ? '70px' : v.aspectRatio === '4:5' ? '70px' : '50px'
                    }}
                  >
                    {v.aspectRatio}
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-neutral-400 space-y-1">
                  <div>Canvas: {v.resolution.w} × {v.resolution.h}</div>
                  <div>Safe Bounds: UI overlay compensation active</div>
                </div>
              </div>

              <button
                onClick={() => handleApplyVariant(v)}
                disabled={isCurrent}
                className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  isCurrent
                    ? 'bg-neutral-800 text-neutral-500 cursor-default'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                }`}
              >
                {isCurrent ? <CheckCircle2 size={13} /> : <Sparkles size={13} />}
                <span>{isCurrent ? 'Active Canvas' : 'Reflow Canvas'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
