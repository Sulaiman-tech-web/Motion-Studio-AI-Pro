import React, { useState } from 'react';
import {
  Music,
  Volume2,
  Radio,
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Coins
} from 'lucide-react';
import { ProjectState, EditorState, EditorAction } from '../../types';
import { GenerativeMediaProvider } from '../../services/generativeMediaProvider';

interface SoundMusicPanelProps {
  project: ProjectState;
  editor: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

export const SoundMusicPanel: React.FC<SoundMusicPanelProps> = ({
  project,
  editor,
  dispatch
}) => {
  const [sfxType, setSfxType] = useState<
    'whoosh' | 'impact' | 'ui_click' | 'transition_sweep' | 'riser' | 'glitch'
  >('whoosh');
  const [sfxIntensity, setSfxIntensity] = useState(80);

  const [musicMood, setMusicMood] = useState('Tech Minimalist & Dark Electronic');
  const [musicGenre, setMusicGenre] = useState('Electronic Kinetic');
  const [musicEnergy, setMusicEnergy] = useState<'low' | 'medium' | 'high' | 'epic'>('high');
  const [bpm, setBpm] = useState(editor.beatSync.bpm || 128);
  const [autoDucking, setAutoDucking] = useState(true);
  const [isGeneratingSfx, setIsGeneratingSfx] = useState(false);
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);

  const provider = GenerativeMediaProvider.getInstance();

  const handleGenerateSFX = async () => {
    setIsGeneratingSfx(true);
    dispatch({ type: 'DEDUCT_CREDITS', payload: 5 });

    setTimeout(async () => {
      const asset = await provider.generateSFX({ type: sfxType, intensity: sfxIntensity });
      dispatch({ type: 'ADD_GENERATED_ASSET', payload: asset });
      setIsGeneratingSfx(false);
    }, 400);
  };

  const handleGenerateMusic = async () => {
    setIsGeneratingMusic(true);
    dispatch({ type: 'DEDUCT_CREDITS', payload: 25 });

    setTimeout(async () => {
      const asset = await provider.generateMusic({
        mood: musicMood,
        genre: musicGenre,
        durationSec: project.duration,
        tempo: bpm,
        energy: musicEnergy
      });
      dispatch({ type: 'ADD_GENERATED_ASSET', payload: asset });
      dispatch({ type: 'UPDATE_BEAT_SYNC', payload: { bpm, enabled: true } });
      setIsGeneratingMusic(false);
    }, 700);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4 text-neutral-200">
      {/* Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Music size={16} className="text-amber-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Sound Effects & Neural Music Generator
            </h2>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Synchronized audio architecture with beat-grid quantization, cinematic stingers, and smart auto-ducking.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded-lg text-xs">
          <Radio size={14} className="text-blue-400" />
          <span className="text-neutral-400">Beat-Grid:</span>
          <span className="font-mono font-bold text-white">{bpm} BPM</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Text-to-SFX */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 space-y-3.5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-2">
              <Zap size={15} className="text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Text-to-SFX Sound FX Generator
              </h3>
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              5 Credits
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'whoosh', label: 'Cinematic Whoosh' },
              { id: 'impact', label: 'Sub-Bass Impact' },
              { id: 'ui_click', label: 'Haptic UI Click' },
              { id: 'transition_sweep', label: 'Transition Sweep' },
              { id: 'riser', label: 'Tension Riser' },
              { id: 'glitch', label: 'Cyber Glitch' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSfxType(t.id as any)}
                className={`py-2 px-2.5 rounded-lg text-xs font-medium text-center border transition ${
                  sfxType === t.id
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold shadow'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div>
            <div className="flex justify-between text-xs text-neutral-400 mb-1">
              <span>Impact Intensity</span>
              <span className="font-mono">{sfxIntensity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={sfxIntensity}
              onChange={(e) => setSfxIntensity(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <button
            onClick={handleGenerateSFX}
            disabled={isGeneratingSfx}
            className="w-full bg-neutral-800 hover:bg-neutral-750 text-white font-bold text-xs py-2 rounded-lg transition flex items-center justify-center gap-1.5 border border-neutral-700"
          >
            {isGeneratingSfx ? <RotateCcw size={13} className="animate-spin" /> : <Sparkles size={13} />}
            <span>{isGeneratingSfx ? 'Synthesizing SFX...' : 'Generate SFX Clip (5 Cr)'}</span>
          </button>
        </div>

        {/* Right: Neural Music Generator */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 space-y-3.5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-2">
              <Music size={15} className="text-blue-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Generative Soundtrack Engine
              </h3>
            </div>
            <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              25 Credits
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <label className="text-[10px] text-neutral-500 block mb-1">Atmospheric Mood</label>
              <select
                value={musicMood}
                onChange={(e) => setMusicMood(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-white outline-none"
              >
                <option value="Tech Minimalist & Dark Electronic">Tech Minimalist & Dark Electronic</option>
                <option value="Cinematic Orchestral Swell">Cinematic Orchestral Swell</option>
                <option value="Lo-Fi Chill & Warm Vinyl">Lo-Fi Chill & Warm Vinyl</option>
                <option value="High-Energy Kinetic Trap">High-Energy Kinetic Trap</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-neutral-500 block mb-1">Energy Arc</label>
                <select
                  value={musicEnergy}
                  onChange={(e) => setMusicEnergy(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-white outline-none"
                >
                  <option value="low">Subtle Ambient</option>
                  <option value="medium">Medium Drive</option>
                  <option value="high">High Velocity</option>
                  <option value="epic">Epic Cinematic Drop</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-neutral-500 block mb-1">Tempo (BPM)</label>
                <input
                  type="number"
                  value={bpm}
                  onChange={(e) => setBpm(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-white outline-none font-mono"
                />
              </div>
            </div>

            {/* Smart Auto-Ducking Switch */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-neutral-200 block">Smart Auto-Ducking</span>
                <span className="text-[10px] text-neutral-500">
                  Ducks background music by -12dB when voiceover is detected
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoDucking}
                onChange={(e) => setAutoDucking(e.target.checked)}
                className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateMusic}
            disabled={isGeneratingMusic}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs py-2 rounded-lg transition flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-900/30"
          >
            {isGeneratingMusic ? <RotateCcw size={13} className="animate-spin" /> : <Sparkles size={13} />}
            <span>{isGeneratingMusic ? 'Synthesizing Soundtrack...' : 'Generate 15s Soundtrack (25 Cr)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
