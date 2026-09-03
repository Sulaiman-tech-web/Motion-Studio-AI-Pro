import React, { useState } from 'react';
import { Sparkles, FileText, ArrowRight, Wand2, CheckCircle, RefreshCw } from 'lucide-react';
import { ProjectState, EditorState, EditorAction, CreativeBrief } from '../../types';
import { GenerativeMediaProvider } from '../../services/generativeMediaProvider';

interface CreativeBriefPanelProps {
  project: ProjectState;
  editor: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

export const CreativeBriefPanel: React.FC<CreativeBriefPanelProps> = ({
  project,
  editor,
  dispatch
}) => {
  const brief: CreativeBrief = project.creativeBrief || {
    id: 'brief_default',
    projectObjective: 'Create a 15-second high-impact commercial showcasing cutting-edge product innovation.',
    product: 'Aura Pro Wireless ANC Headphones',
    audience: 'Audiophiles & digital creators (22-40)',
    platform: 'Omni-channel',
    duration: 15,
    aspectRatio: '16:9',
    visualStyle: 'Dark luxury cinematic studio lighting with electric cobalt rim glow',
    brandPersonality: 'Sophisticated, innovative, relentless focus',
    keyMessage: 'Silence the noise. Amplify your craft.',
    cta: 'Experience Pure Sound • Order Now',
    voiceStyle: 'Deep, measured, confident baritone',
    musicStyle: 'Minimalist electronic with sub-bass drop and crisp atmospheric transients',
    requiredAssets: 'Product Hero Cutout, Exploded Driver Chamber, Lifestyle B-roll',
    restrictions: 'Preserve safe margins, avoid harsh strobes, maintain 4.5:1 contrast'
  };

  const [promptInput, setPromptInput] = useState(
    'Create a 15-second premium advertisement for a wireless headphone'
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateBrief = async () => {
    setIsGenerating(true);
    // Simulate high-fidelity AI generation delay
    setTimeout(() => {
      const provider = GenerativeMediaProvider.getInstance();
      const generated = provider.generateCreativeBrief(promptInput, project.brandKit);
      dispatch({ type: 'UPDATE_CREATIVE_BRIEF', payload: generated });
      setIsGenerating(false);
    }, 600);
  };

  const handleApplyToStoryboard = () => {
    const provider = GenerativeMediaProvider.getInstance();
    const newScenes = provider.generateStoryboard(brief);
    dispatch({ type: 'SET_STORYBOARD_SCENES', payload: newScenes });
    dispatch({ type: 'SET_CREATE_SUB_TAB', payload: 'storyboard' });
  };

  const samplePrompts = [
    'Create a 15-second premium advertisement for a wireless headphone',
    'High-energy 10s kinetic typography launch for an AI productivity app',
    'Dark luxury fashion commercial with cinematic macro camera movement',
    'Minimalist consumer hardware reveal with titanium explode animation'
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-5 text-neutral-200">
      {/* Header prompt input */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-2 text-blue-400 font-semibold text-xs tracking-wider uppercase">
          <Sparkles size={15} />
          <span>AI Creative Director • Brief Generator</span>
        </div>
        <p className="text-xs text-neutral-400 mb-3">
          Input your product concept or campaign goal. AI generates a comprehensive creative brief with full target, scene strategy, and visual tone.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="e.g. Create a 15-second premium advertisement for a wireless headphone"
            className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleGenerateBrief}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg transition flex items-center gap-1.5 shrink-0 shadow-md shadow-blue-600/30"
          >
            {isGenerating ? <RefreshCw size={14} className="animate-spin" /> : <Wand2 size={14} />}
            <span>{isGenerating ? 'Synthesizing...' : 'Generate Brief'}</span>
          </button>
        </div>

        {/* Quick prompt suggestions */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setPromptInput(p)}
              className="text-[10px] bg-neutral-800/80 hover:bg-neutral-750 text-neutral-400 hover:text-neutral-200 px-2 py-1 rounded transition border border-neutral-750 text-left truncate max-w-xs"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Brief Breakdown Grid */}
      <div className="bg-neutral-900/60 border border-neutral-800/90 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-emerald-400" />
            <h3 className="text-xs font-bold text-neutral-100 uppercase tracking-wider">Active Creative Brief</h3>
          </div>
          <button
            onClick={handleApplyToStoryboard}
            className="text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-lg transition flex items-center gap-1.5 shadow"
          >
            <span>Auto-Generate Storyboard</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          <div>
            <label className="text-[10px] font-bold uppercase text-neutral-500 block mb-1">Project Objective</label>
            <textarea
              rows={2}
              value={brief.projectObjective}
              onChange={(e) => dispatch({ type: 'UPDATE_CREATIVE_BRIEF', payload: { projectObjective: e.target.value } })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-neutral-200 outline-none focus:border-blue-500 text-xs resize-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-neutral-500 block mb-1">Product / Offering</label>
            <input
              type="text"
              value={brief.product}
              onChange={(e) => dispatch({ type: 'UPDATE_CREATIVE_BRIEF', payload: { product: e.target.value } })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200 outline-none focus:border-blue-500 text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-neutral-500 block mb-1">Target Audience</label>
            <input
              type="text"
              value={brief.audience}
              onChange={(e) => dispatch({ type: 'UPDATE_CREATIVE_BRIEF', payload: { audience: e.target.value } })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200 outline-none focus:border-blue-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold uppercase text-neutral-500 block mb-1">Platform</label>
              <select
                value={brief.platform}
                onChange={(e) => dispatch({ type: 'UPDATE_CREATIVE_BRIEF', payload: { platform: e.target.value as any } })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-neutral-200 outline-none focus:border-blue-500 text-xs"
              >
                <option value="Omni-channel">Omni-channel</option>
                <option value="TikTok">TikTok (9:16)</option>
                <option value="Instagram Reels">Instagram Reels</option>
                <option value="YouTube">YouTube (16:9)</option>
                <option value="Landscape Ad">Landscape Ad</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-neutral-500 block mb-1">Duration & Aspect</label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  value={brief.duration}
                  onChange={(e) => dispatch({ type: 'UPDATE_CREATIVE_BRIEF', payload: { duration: Number(e.target.value) } })}
                  className="w-16 bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-neutral-200 outline-none focus:border-blue-500 text-xs text-center"
                />
                <span className="self-center text-neutral-500 text-[11px]">sec</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-neutral-500 block mb-1">Visual Direction & Lighting</label>
            <input
              type="text"
              value={brief.visualStyle}
              onChange={(e) => dispatch({ type: 'UPDATE_CREATIVE_BRIEF', payload: { visualStyle: e.target.value } })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200 outline-none focus:border-blue-500 text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-neutral-500 block mb-1">Key Message / Hook</label>
            <input
              type="text"
              value={brief.keyMessage}
              onChange={(e) => dispatch({ type: 'UPDATE_CREATIVE_BRIEF', payload: { keyMessage: e.target.value } })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200 outline-none focus:border-blue-500 text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-neutral-500 block mb-1">Call to Action (CTA)</label>
            <input
              type="text"
              value={brief.cta}
              onChange={(e) => dispatch({ type: 'UPDATE_CREATIVE_BRIEF', payload: { cta: e.target.value } })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200 outline-none focus:border-blue-500 text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-neutral-500 block mb-1">Voiceover Cadence & Style</label>
            <input
              type="text"
              value={brief.voiceStyle}
              onChange={(e) => dispatch({ type: 'UPDATE_CREATIVE_BRIEF', payload: { voiceStyle: e.target.value } })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200 outline-none focus:border-blue-500 text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-neutral-500 block mb-1">Soundtrack & Audio Architecture</label>
            <input
              type="text"
              value={brief.musicStyle}
              onChange={(e) => dispatch({ type: 'UPDATE_CREATIVE_BRIEF', payload: { musicStyle: e.target.value } })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200 outline-none focus:border-blue-500 text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-neutral-500 block mb-1">Required Assets & Cutouts</label>
            <input
              type="text"
              value={brief.requiredAssets}
              onChange={(e) => dispatch({ type: 'UPDATE_CREATIVE_BRIEF', payload: { requiredAssets: e.target.value } })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200 outline-none focus:border-blue-500 text-xs"
            />
          </div>
        </div>

        {/* Action Button to Launch Storyboard */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleApplyToStoryboard}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs py-2.5 px-5 rounded-lg shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
          >
            <Sparkles size={15} />
            <span>Generate Storyboard from Brief & Build Timeline</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
