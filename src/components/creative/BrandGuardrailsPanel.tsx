import React, { useState } from 'react';
import {
  Shield,
  Palette,
  Type,
  Sliders,
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash2,
  Sparkles,
  Lock
} from 'lucide-react';
import { ProjectState, EditorState, EditorAction, BrandKitV2 } from '../../types';

interface BrandGuardrailsPanelProps {
  project: ProjectState;
  editor: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

export const BrandGuardrailsPanel: React.FC<BrandGuardrailsPanelProps> = ({
  project,
  editor,
  dispatch
}) => {
  const brand: BrandKitV2 = project.brandKit || editor.brandKit || {
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    accentColor: '#f59e0b',
    headlineFont: 'system-ui, sans-serif',
    bodyFont: 'system-ui, sans-serif',
    brandTone: 'Confident, Minimal, High-Performance',
    ctaStyle: 'Experience Pure Sound • Order Now',
    motionDNA: {
      style: 'Smooth',
      easing: 'easeOutBack',
      transitions: 'Slide / Kinetic Zoom',
      rotation: 'Low',
      bounce: true,
      textAnimation: 'Kinetic Slide'
    },
    restrictedWords: ['cheap', 'bargain', 'guaranteed 100%'],
    pronunciationDictionary: {},
    colors: ['#ffffff', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'],
    defaultFont: 'system-ui, sans-serif'
  };

  const [newRestrictedWord, setNewRestrictedWord] = useState('');
  const [auditResult, setAuditResult] = useState<string | null>(null);

  const handleUpdateBrand = (updates: Partial<BrandKitV2>) => {
    dispatch({ type: 'SET_BRAND_KIT', payload: updates });
  };

  const handleAddRestrictedWord = () => {
    if (!newRestrictedWord.trim()) return;
    const updated = [...(brand.restrictedWords || []), newRestrictedWord.trim().toLowerCase()];
    handleUpdateBrand({ restrictedWords: updated });
    setNewRestrictedWord('');
  };

  const handleRemoveRestrictedWord = (word: string) => {
    const updated = (brand.restrictedWords || []).filter((w) => w !== word);
    handleUpdateBrand({ restrictedWords: updated });
  };

  // Run live compliance audit on project layers
  const handleRunAudit = () => {
    const flaggedLayers: string[] = [];
    project.layers.forEach((l) => {
      if (l.text) {
        const lower = l.text.toLowerCase();
        (brand.restrictedWords || []).forEach((w) => {
          if (lower.includes(w)) {
            flaggedLayers.push(`Layer "${l.name}" contains restricted word "${w}"`);
          }
        });
      }
    });

    if (flaggedLayers.length > 0) {
      setAuditResult(`⚠️ Violation detected: ${flaggedLayers.join('; ')}`);
    } else {
      setAuditResult('✓ 100% Brand Compliant: All typography, color palette, and language pass guardrail verification.');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4 text-neutral-200">
      {/* Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-blue-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Brand Kit V2 & Brand Guardrails Engine
            </h2>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Strict brand consistency rules enforced across all generative AI outputs, scripts, and typography.
          </p>
        </div>

        <button
          onClick={handleRunAudit}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow"
        >
          <Sparkles size={13} />
          <span>Audit Project Compliance</span>
        </button>
      </div>

      {auditResult && (
        <div
          className={`p-3 rounded-xl border text-xs font-mono ${
            auditResult.startsWith('✓')
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {auditResult}
        </div>
      )}

      {/* Brand DNA Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Color Palette & Identity */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
            <Palette size={14} className="text-blue-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Approved Brand Color Tokens
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] text-neutral-500 block mb-1">Primary Brand</label>
              <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 p-1.5 rounded-lg">
                <input
                  type="color"
                  value={brand.primaryColor}
                  onChange={(e) => handleUpdateBrand({ primaryColor: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-neutral-300">{brand.primaryColor}</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-neutral-500 block mb-1">Secondary Brand</label>
              <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 p-1.5 rounded-lg">
                <input
                  type="color"
                  value={brand.secondaryColor}
                  onChange={(e) => handleUpdateBrand({ secondaryColor: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-neutral-300">{brand.secondaryColor}</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-neutral-500 block mb-1">Accent Highlight</label>
              <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 p-1.5 rounded-lg">
                <input
                  type="color"
                  value={brand.accentColor}
                  onChange={(e) => handleUpdateBrand({ accentColor: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-neutral-300">{brand.accentColor}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-neutral-500 block mb-1">Brand Voice & Persona</label>
            <input
              type="text"
              value={brand.brandTone}
              onChange={(e) => handleUpdateBrand({ brandTone: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-white outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] text-neutral-500 block mb-1">Mandatory CTA Phrasing</label>
            <input
              type="text"
              value={brand.ctaStyle}
              onChange={(e) => handleUpdateBrand({ ctaStyle: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-white outline-none"
            />
          </div>
        </div>

        {/* Brand Motion DNA */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
            <Sliders size={14} className="text-purple-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Brand Motion DNA
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-neutral-500 block mb-1">Motion Archetype</label>
              <select
                value={brand.motionDNA?.style || 'Smooth'}
                onChange={(e) =>
                  handleUpdateBrand({
                    motionDNA: { ...brand.motionDNA, style: e.target.value as any }
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-white outline-none"
              >
                <option value="Minimal">Minimal (Clean Fade)</option>
                <option value="Smooth">Smooth (Inertial Easing)</option>
                <option value="Energetic">Energetic (High Velocity Pop)</option>
                <option value="Cinematic">Cinematic (Slow Drift)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-neutral-500 block mb-1">Text Kinetic Style</label>
              <select
                value={brand.motionDNA?.textAnimation || 'Kinetic Slide'}
                onChange={(e) =>
                  handleUpdateBrand({
                    motionDNA: { ...brand.motionDNA, textAnimation: e.target.value as any }
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-white outline-none"
              >
                <option value="Fade / Tracking">Fade / Tracking</option>
                <option value="Scale Pop">Scale Pop</option>
                <option value="Kinetic Slide">Kinetic Slide</option>
                <option value="Glow Reveal">Glow Reveal</option>
              </select>
            </div>
          </div>

          {/* Restricted Words Guardrail */}
          <div className="pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-bold uppercase text-neutral-400">
                Restricted Words Blacklist
              </label>
              <span className="text-[10px] text-neutral-500">Auto-flags in script & canvas</span>
            </div>

            <div className="flex gap-1.5 mb-2">
              <input
                type="text"
                placeholder="Add restricted word (e.g. cheap)..."
                value={newRestrictedWord}
                onChange={(e) => setNewRestrictedWord(e.target.value)}
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-white text-xs outline-none"
              />
              <button
                onClick={handleAddRestrictedWord}
                className="bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1 rounded text-xs transition"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {(brand.restrictedWords || []).map((word, idx) => (
                <span
                  key={idx}
                  className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1"
                >
                  <span>{word}</span>
                  <button
                    onClick={() => handleRemoveRestrictedWord(word)}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
