import React from 'react';
import {
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Zap,
  Eye,
  Volume2,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { ProjectState, EditorState, EditorAction } from '../../types';
import { GenerativeMediaProvider } from '../../services/generativeMediaProvider';

interface QualityInspectorPanelProps {
  project: ProjectState;
  editor: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

export const QualityInspectorPanel: React.FC<QualityInspectorPanelProps> = ({
  project,
  editor
}) => {
  const provider = GenerativeMediaProvider.getInstance();
  const report = provider.analyzeProject(project, project.creativeBrief);

  const getScoreColor = (val: number) => {
    if (val >= 90) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (val >= 75) return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4 text-neutral-200">
      {/* Header Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Creative Review & Quality Inspector
            </h2>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Automated quality audit verifying retention hooks, brand compliance, audio clarity, and 4K/120 FPS master health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">Master Health Score:</span>
          <div className={`px-3 py-1 rounded-lg border font-mono font-bold text-sm ${getScoreColor(report.overallScore)}`}>
            {report.overallScore} / 100
          </div>
        </div>
      </div>

      {/* Core Quality Meters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Hook Power', score: report.hookScore, icon: Eye },
          { label: 'Pacing Rhythm', score: report.pacingScore, icon: Clock },
          { label: 'Brand Alignment', score: report.brandScore, icon: Sparkles },
          { label: 'Typography Readability', score: report.readabilityScore, icon: Info },
          { label: 'Audio Balance', score: report.audioScore, icon: Volume2 }
        ].map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-3 text-center">
              <Icon size={16} className="mx-auto text-neutral-400 mb-1" />
              <div className="text-lg font-mono font-bold text-white mb-0.5">{m.score}%</div>
              <div className="text-[10px] text-neutral-400 uppercase font-medium">{m.label}</div>
            </div>
          );
        })}
      </div>

      {/* Hook Analysis (1s, 3s, 5s) */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-neutral-800 pb-2">
          <Zap size={14} className="text-amber-400" />
          <span>Retention Hook Chronology (0s - 5s)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 space-y-1">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block">
              Second 0.0 - 1.0 (Awakening)
            </span>
            <p className="text-neutral-300 text-[11px]">{report.hookAnalysis.first1Sec}</p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 space-y-1">
            <span className="text-[10px] font-mono font-bold text-blue-400 uppercase block">
              Second 1.0 - 3.0 (Retention)
            </span>
            <p className="text-neutral-300 text-[11px]">{report.hookAnalysis.first3Sec}</p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 space-y-1">
            <span className="text-[10px] font-mono font-bold text-purple-400 uppercase block">
              Second 3.0 - 5.0 (Transition)
            </span>
            <p className="text-neutral-300 text-[11px]">{report.hookAnalysis.first5Sec}</p>
          </div>
        </div>
      </div>

      {/* Technical Warnings & Validation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 space-y-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle size={14} className="text-emerald-400" />
            <span>AI Studio Recommendations</span>
          </h4>
          <ul className="space-y-1.5 text-neutral-300 text-[11px]">
            {report.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 space-y-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle size={14} className="text-amber-400" />
            <span>High-FPS & Resolution Engine Alerts</span>
          </h4>
          <div className="space-y-1.5 text-[11px]">
            {report.fpsWarnings.map((w, i) => (
              <div key={i} className="text-neutral-300 bg-neutral-950 p-2 rounded border border-neutral-850">
                {w}
              </div>
            ))}
            {report.resolutionWarnings.map((w, i) => (
              <div key={i} className="text-neutral-300 bg-neutral-950 p-2 rounded border border-neutral-850">
                {w}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
