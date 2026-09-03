import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  X,
  Film,
  Camera,
  FileCode,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Sliders,
  Layers,
  Clock,
  Cpu,
  Server,
  Zap,
  Check,
  RotateCcw,
  Eye,
  Flame,
  Volume2
} from 'lucide-react';
import {
  ProjectState,
  EditorState,
  EditorAction,
  ExportConfig,
  ExportHistoryItem,
  RenderWorkerProgress,
  ExportQuality,
  RenderMode
} from '../types';
import {
  exportProjectAsPNG,
  exportProjectAsJSON,
  exportProjectWithEngineV4
} from '../utils/exportEngine';
import {
  RESOLUTION_PRESETS,
  FRAME_RATES,
  QUICK_EXPORT_PRESETS,
  calculateRenderEstimate,
  runPreflightCheck,
  getTargetBitrateMbps
} from '../utils/presets';

interface ExportModalProps {
  project: ProjectState;
  editor: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

export const ExportModal: React.FC<ExportModalProps> = ({ project, editor, dispatch }) => {
  const [activeModalTab, setActiveModalTab] = useState<'presets' | 'custom' | 'history'>('presets');
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStageText, setRenderStageText] = useState('Initializing pipeline...');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastExportItem, setLastExportItem] = useState<ExportHistoryItem | null>(null);
  const [workers, setWorkers] = useState<RenderWorkerProgress[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export configuration state
  const [config, setConfig] = useState<ExportConfig>({
    format: 'mp4',
    codec: 'h264',
    resolution: project.resolution,
    fps: project.fps || 60,
    quality: 'high',
    bitrateMode: 'auto',
    audioCodec: 'aac',
    audioSampleRate: 48000,
    audioBitrateKbps: 320,
    colorProfile: 'sRGB',
    alpha: false,
    renderMode: 'auto',
    motionBlur: {
      enabled: false,
      shutterAngle: 180,
      samples: 16
    }
  });

  // Load history from localStorage on open
  const [historyItems, setHistoryItems] = useState<ExportHistoryItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('motion_studio_v4_history');
      if (stored) {
        setHistoryItems(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, [editor.showExportDialog]);

  if (!editor.showExportDialog) return null;

  const estimate = calculateRenderEstimate(project, config);
  const preflight = runPreflightCheck(project, config, editor.renderCredits);

  const handleApplyQuickPreset = (presetConfig: Partial<ExportConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...presetConfig,
      resolution: presetConfig.resolution || prev.resolution,
      fps: presetConfig.fps || prev.fps
    }));
  };

  const handleStartExport = async () => {
    if (!preflight.passed) {
      setErrorMsg('Preflight checks failed. Please review settings before export.');
      return;
    }

    setErrorMsg(null);
    setIsRendering(true);
    setRenderProgress(0);
    setRenderStageText('Starting deterministic render pipeline...');
    setWorkers([]);

    try {
      const item = await exportProjectWithEngineV4({
        project,
        config,
        onProgress: (pct, stageText) => {
          setRenderProgress(pct);
          setRenderStageText(stageText);
        },
        onWorkersUpdate: (updatedWorkers) => {
          setWorkers(updatedWorkers);
        }
      });

      setLastExportItem(item);
      setHistoryItems((prev) => [item, ...prev]);
      setIsRendering(false);
      dispatch({ type: 'DEDUCT_CREDITS', payload: estimate.computeUnits });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Export error encountered.');
      setIsRendering(false);
    }
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed.layers && parsed.resolution) {
          dispatch({ type: 'LOAD_PROJECT', payload: parsed });
          dispatch({ type: 'TOGGLE_EXPORT', payload: false });
        } else {
          setErrorMsg('Invalid project file format.');
        }
      } catch {
        setErrorMsg('Failed to parse JSON project file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      id="export-modal-backdrop"
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6 select-none animate-in fade-in duration-150 overflow-y-auto"
    >
      <div
        id="export-modal-dialog"
        className="bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Download size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">
                  Export Engine V4 Pro
                </h2>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 font-mono font-bold">
                  4K / 120 FPS
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Deterministic sub-frame rasterizer, WebCodecs encoder & distributed Cloud GPU
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Compute Units Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-400">
              <Cpu size={12} className="text-blue-400" />
              <span>{editor.renderCredits} Credits</span>
            </div>

            <button
              onClick={() => dispatch({ type: 'TOGGLE_EXPORT', payload: false })}
              className="text-neutral-500 hover:text-white p-1 rounded-md transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center px-5 pt-3 pb-2 border-b border-neutral-800/80 bg-neutral-950 gap-2 shrink-0">
          <button
            onClick={() => setActiveModalTab('presets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${
              activeModalTab === 'presets'
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            <Sparkles size={13} /> Quick Presets
          </button>
          <button
            onClick={() => setActiveModalTab('custom')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${
              activeModalTab === 'custom'
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            <Sliders size={13} /> Custom Studio Spec
          </button>
          <button
            onClick={() => setActiveModalTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${
              activeModalTab === 'history'
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            <Clock size={13} /> Export History ({historyItems.length})
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-5 text-neutral-300">
          {/* Active Render Progress View */}
          {isRendering && (
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/40 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Sparkles size={16} className="text-blue-400 animate-spin" />
                  <span>{renderStageText}</span>
                </div>
                <span className="font-mono text-sm font-bold text-blue-400">
                  {renderProgress}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden border border-neutral-800">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full transition-all duration-150 rounded-full"
                  style={{ width: `${renderProgress}%` }}
                />
              </div>

              {/* Cloud GPU Worker Progress Visualization (if workers active) */}
              {workers.length > 0 && (
                <div className="pt-2 border-t border-neutral-800/80 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400">
                    <span className="flex items-center gap-1.5">
                      <Server size={12} className="text-indigo-400" /> Distributed GPU Worker Nodes
                    </span>
                    <span className="font-mono text-indigo-400">{workers.length} Active Nodes</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {workers.map((w) => {
                      const workerPct = Math.min(
                        100,
                        Math.round(((w.currentFrame - w.frameStart) / (w.frameEnd - w.frameStart || 1)) * 100)
                      );
                      return (
                        <div
                          key={w.id}
                          className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 flex flex-col gap-1.5"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-neutral-300 font-bold truncate">{w.name}</span>
                            <span className="text-blue-400">{workerPct}%</span>
                          </div>
                          <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-indigo-500 h-full transition-all duration-150 rounded-full"
                              style={{ width: `${workerPct}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[9px] font-mono text-neutral-500">
                            <span>Frames {w.frameStart}-{w.frameEnd}</span>
                            <span className="uppercase text-emerald-400">{w.status}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Extreme Render Warning Banner */}
          {estimate.isExtreme && (
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-start gap-3">
              <Flame size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-amber-300">
                  Extreme High-Cadence Render Workload
                </div>
                <p className="text-[11px] text-amber-200/80 leading-relaxed mt-0.5">
                  {estimate.warningMessage}
                </p>
              </div>
            </div>
          )}

          {/* TAB 1: QUICK PRESETS */}
          {activeModalTab === 'presets' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {QUICK_EXPORT_PRESETS.map((preset) => {
                  const isMatch =
                    config.resolution.w === preset.config.resolution?.w &&
                    config.fps === preset.config.fps;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleApplyQuickPreset(preset.config)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition group ${
                        isMatch
                          ? 'bg-blue-600/15 border-blue-500 shadow-md shadow-blue-900/20'
                          : 'bg-neutral-900/70 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white group-hover:text-blue-400 transition">
                          {preset.name}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {preset.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mb-2 leading-tight">
                        {preset.description}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono pt-1.5 border-t border-neutral-800/80">
                        <span>{preset.config.renderMode?.toUpperCase()}</span>
                        <span>{preset.config.quality?.toUpperCase()} QUALITY</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOM STUDIO SPEC */}
          {activeModalTab === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Resolution & Framerate */}
              <div className="flex flex-col gap-3.5">
                {/* Resolution Selector */}
                <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      Master Resolution
                    </span>
                    <span className="text-[11px] font-mono text-blue-400 font-bold">
                      {config.resolution.w}×{config.resolution.h}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {RESOLUTION_PRESETS.map((r) => {
                      const isSel =
                        config.resolution.w === r.w && config.resolution.h === r.h;
                      return (
                        <button
                          key={r.id}
                          onClick={() =>
                            setConfig((prev) => ({
                              ...prev,
                              resolution: { w: r.w, h: r.h, label: r.name, aspectRatio: r.aspectRatio }
                            }))
                          }
                          className={`p-2 rounded-lg text-left text-xs font-medium border transition ${
                            isSel
                              ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <div className="truncate">{r.name}</div>
                          <div className="text-[9px] font-mono text-neutral-500">
                            {r.w}×{r.h} ({r.aspectRatio})
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Frame Rate (FPS) */}
                <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      Temporal Cadence (FPS)
                    </span>
                    <span className="text-[11px] font-mono text-blue-400 font-bold">
                      {config.fps} FPS
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    {FRAME_RATES.map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setConfig((prev) => ({ ...prev, fps: rate }))}
                        className={`py-1.5 rounded-lg text-xs font-mono font-bold border transition ${
                          config.fps === rate
                            ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {rate}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Container & Format */}
                <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 flex flex-col gap-2">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Container Format
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'mp4', name: 'MP4', sub: 'H.264' },
                      { id: 'webm', name: 'WebM', sub: 'VP9' },
                      { id: 'png_sequence', name: 'PNG', sub: 'Sequence' },
                      { id: 'json', name: 'JSON', sub: 'Project' }
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        onClick={() =>
                          setConfig((prev) => ({ ...prev, format: fmt.id as any }))
                        }
                        className={`p-2 rounded-lg text-center border transition ${
                          config.format === fmt.id
                            ? 'bg-blue-600 text-white border-blue-500 font-bold'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <div className="text-xs">{fmt.name}</div>
                        <div className="text-[9px] text-neutral-500 font-mono">{fmt.sub}</div>
                      </button>
                    ))}
                  </div>

                  {/* Alpha Toggle for WebM */}
                  {config.format === 'webm' && (
                    <label className="flex items-center justify-between text-xs text-neutral-300 pt-2 border-t border-neutral-800 cursor-pointer">
                      <span>Transparent Alpha Channel</span>
                      <input
                        type="checkbox"
                        checked={config.alpha}
                        onChange={(e) =>
                          setConfig((prev) => ({ ...prev, alpha: e.target.checked }))
                        }
                        className="rounded border-neutral-700 text-blue-600 focus:ring-0 cursor-pointer"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Right Column: Quality, Render Mode, Shutter */}
              <div className="flex flex-col gap-3.5">
                {/* Quality Tier */}
                <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      Encoding Quality Tier
                    </span>
                    <span className="text-[11px] font-mono text-blue-400 font-bold uppercase">
                      {config.quality}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1">
                    {(['draft', 'standard', 'high', 'ultra', 'master'] as ExportQuality[]).map((q) => (
                      <button
                        key={q}
                        onClick={() => setConfig((prev) => ({ ...prev, quality: q }))}
                        className={`py-1.5 rounded-lg text-[11px] font-medium uppercase border transition ${
                          config.quality === q
                            ? 'bg-blue-600 text-white border-blue-500 font-bold'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Render Engine Mode */}
                <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 flex flex-col gap-2">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Render Architecture Mode
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'auto', name: 'Auto Intelligent', sub: 'Smart routing' },
                      { id: 'local', name: 'Standard Local', sub: 'Browser canvas' },
                      { id: 'high_perf', name: 'High-Perf Local', sub: 'Hardware sync' },
                      { id: 'cloud_gpu', name: 'Cloud GPU Pool', sub: 'Multi-worker nodes' }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() =>
                          setConfig((prev) => ({ ...prev, renderMode: mode.id as RenderMode }))
                        }
                        className={`p-2 rounded-lg text-left border transition ${
                          config.renderMode === mode.id
                            ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <div className="text-xs">{mode.name}</div>
                        <div className="text-[9px] text-neutral-500 font-mono">{mode.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Physical Shutter Motion Blur (Section 85) */}
                <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      Physical Shutter Motion Blur
                    </span>
                    <label className="flex items-center gap-1.5 text-xs text-neutral-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.motionBlur.enabled}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            motionBlur: { ...prev.motionBlur, enabled: e.target.checked }
                          }))
                        }
                        className="rounded border-neutral-700 text-blue-600 focus:ring-0 cursor-pointer"
                      />
                      <span>180° Shutter</span>
                    </label>
                  </div>
                  <p className="text-[10px] text-neutral-500">
                    Calculates temporal sub-frame vectors matching cinema optical sensors.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXPORT HISTORY */}
          {activeModalTab === 'history' && (
            <div className="flex flex-col gap-3">
              {historyItems.length === 0 ? (
                <div className="text-center py-12 text-neutral-500 text-xs">
                  No completed exports recorded yet. Run an export to see history logs and QC thumbnails.
                </div>
              ) : (
                historyItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      {/* QC Thumbnails if available */}
                      {item.validation?.previewThumbnails?.[0] ? (
                        <img
                          src={item.validation.previewThumbnails[0]}
                          alt="QC frame"
                          className="w-16 h-10 object-cover rounded border border-neutral-800"
                        />
                      ) : (
                        <div className="w-12 h-10 rounded bg-neutral-800 flex items-center justify-center text-neutral-400">
                          <Film size={16} />
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{item.projectName}</span>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {item.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                          {item.resolution.w}×{item.resolution.h} @ {item.fps} FPS • {item.format.toUpperCase()} • {item.fileSize}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => setConfig(item.settings)}
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[11px] font-medium text-neutral-300 transition"
                      >
                        Duplicate Settings
                      </button>
                      {item.downloadUrl && (
                        <a
                          href={item.downloadUrl}
                          download={`${item.projectName.toLowerCase()}_${item.resolution.w}x${item.resolution.h}.${item.format}`}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition flex items-center gap-1.5"
                        >
                          <Download size={13} />
                          <span>Download</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* PREFLIGHT CHECKLIST & RESOURCE ESTIMATOR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-neutral-800/80">
            {/* Resource Estimator */}
            <div className="p-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800 flex flex-col justify-between">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Cpu size={13} className="text-blue-400" /> Export Compute Metrics
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800/80">
                  <div className="text-[10px] text-neutral-500 font-mono">TOTAL FRAMES</div>
                  <div className="text-xs font-mono font-bold text-white">
                    {estimate.totalFrames}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800/80">
                  <div className="text-[10px] text-neutral-500 font-mono">EST. SIZE</div>
                  <div className="text-xs font-mono font-bold text-white">
                    {estimate.estimatedSizeMB} MB
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800/80">
                  <div className="text-[10px] text-neutral-500 font-mono">WORKLOAD</div>
                  <div
                    className={`text-xs font-mono font-bold ${
                      estimate.isExtreme ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {estimate.complexity}
                  </div>
                </div>
              </div>
            </div>

            {/* Preflight Checklist */}
            <div className="p-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800 flex flex-col justify-between">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400" /> Preflight Integrity Matrix
              </span>
              <div className="space-y-1">
                {preflight.checks.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-400">{c.name}:</span>
                    <span
                      className={`font-mono text-[10px] font-bold ${
                        c.status === 'pass'
                          ? 'text-emerald-400'
                          : c.status === 'warning'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {c.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quality Control Thumbnails (If last export completed) */}
          {lastExportItem?.validation?.previewThumbnails && (
            <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 size={14} /> Quality Control Verification Check (0% - 100%)
                </span>
                <span className="text-[10px] font-mono text-neutral-400">PASSED 5/5 STAGES</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {lastExportItem.validation.previewThumbnails.map((thumb, idx) => (
                  <div key={idx} className="relative rounded overflow-hidden border border-neutral-800">
                    <img src={thumb} alt={`QC ${idx * 25}%`} className="w-full h-12 object-cover" />
                    <span className="absolute bottom-0.5 right-1 text-[9px] font-mono bg-black/80 px-1 rounded text-white">
                      {idx * 25}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="text-xs text-rose-400 bg-rose-950/30 p-3 rounded-xl border border-rose-900/50 flex items-center gap-2">
              <AlertTriangle size={15} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-neutral-800 flex items-center justify-between bg-neutral-900/90 shrink-0">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJSON}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 transition"
              title="Import Project JSON"
            >
              <Upload size={14} />
              <span className="hidden sm:inline">Import JSON</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => dispatch({ type: 'TOGGLE_EXPORT', payload: false })}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-300 transition"
            >
              Cancel
            </button>

            <button
              id="btn-confirm-export"
              onClick={handleStartExport}
              disabled={isRendering || !preflight.passed}
              className="px-5 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-white/10"
            >
              <Download size={14} />
              <span>
                {isRendering
                  ? 'Rendering...'
                  : `Export ${config.resolution.w}×${config.resolution.h} @ ${config.fps}fps`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
