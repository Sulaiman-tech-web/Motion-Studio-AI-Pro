import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  Mic,
  Sparkles,
  Play,
  Pause,
  BookOpen,
  Globe,
  Sliders,
  Plus,
  Trash2,
  CheckCircle,
  Coins
} from 'lucide-react';
import { ProjectState, EditorState, EditorAction } from '../../types';
import { GenerativeMediaProvider } from '../../services/generativeMediaProvider';
import { generateId } from '../../utils/animation';

interface VoiceStudioPanelProps {
  project: ProjectState;
  editor: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

export const VoiceStudioPanel: React.FC<VoiceStudioPanelProps> = ({
  project,
  editor,
  dispatch
}) => {
  const [script, setScript] = useState(
    'Silence is not the absence of sound. It is the beginning of total creative clarity. Experience Aura Pro today.'
  );
  const [language, setLanguage] = useState<'en' | 'id' | 'ja' | 'es'>('en');
  const [voice, setVoice] = useState('Baritone Commercial Master');
  const [emotion, setEmotion] = useState('Confident & Measured');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [dictKey, setDictKey] = useState('');
  const [dictValue, setDictValue] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const provider = GenerativeMediaProvider.getInstance();

  // Waveform visualization effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Draw background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Draw waveform bars
      const numBars = 48;
      const barWidth = width / numBars - 2;

      for (let i = 0; i < numBars; i++) {
        const x = i * (barWidth + 2);
        const amp = isPlayingPreview
          ? Math.sin(phase + i * 0.3) * 0.5 + Math.cos(phase * 1.5 + i * 0.2) * 0.4
          : Math.sin(i * 0.2) * 0.3;
        const barHeight = Math.max(4, Math.abs(amp) * (height * 0.7));

        const gradient = ctx.createLinearGradient(0, centerY - barHeight / 2, 0, centerY + barHeight / 2);
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, '#8b5cf6');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, centerY - barHeight / 2, barWidth, barHeight);
      }

      if (isPlayingPreview) {
        phase += 0.15;
      }
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlayingPreview]);

  const handleGenerateVoice = async () => {
    setIsGenerating(true);
    dispatch({ type: 'DEDUCT_CREDITS', payload: 10 });

    setTimeout(async () => {
      const asset = await provider.generateVoice({
        script,
        voice,
        language,
        speed,
        pitch,
        emotion
      });
      dispatch({ type: 'ADD_GENERATED_ASSET', payload: asset });
      setIsGenerating(false);
      setIsPlayingPreview(true);
      setTimeout(() => setIsPlayingPreview(false), 4000);
    }, 600);
  };

  const handleAddPronunciation = () => {
    if (!dictKey.trim() || !dictValue.trim()) return;
    const existing = project.brandKit?.pronunciationDictionary || {};
    dispatch({
      type: 'SET_BRAND_KIT',
      payload: {
        pronunciationDictionary: {
          ...existing,
          [dictKey.trim()]: dictValue.trim()
        }
      }
    });
    setDictKey('');
    setDictValue('');
  };

  const pronunciationDict = project.brandKit?.pronunciationDictionary || {
    Aura: 'AW-rah',
    ANC: 'A-N-C'
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4 text-neutral-200">
      {/* Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Mic size={16} className="text-emerald-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              AI Voiceover Studio Pro
            </h2>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Multi-lingual neural voice synthesis with fine acoustic cadence, pitch modulation, and phonetic dictionaries.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded-lg text-xs">
          <Coins size={14} className="text-amber-400" />
          <span className="text-neutral-400">10 Credits / Generation</span>
        </div>
      </div>

      {/* Script & Voice Setup Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Script input & Waveform */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold text-neutral-500">
                Spoken Voiceover Script
              </label>
              <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                <Globe size={11} className="text-blue-400" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="bg-neutral-950 text-white rounded px-2 py-0.5 text-[11px] outline-none border border-neutral-800"
                >
                  <option value="en">English (US Master)</option>
                  <option value="id">Indonesian (Bahasa Natural)</option>
                  <option value="ja">Japanese (Tokyo Studio)</option>
                  <option value="es">Spanish (Castilian/LatAm)</option>
                </select>
              </div>
            </div>

            <textarea
              rows={3}
              value={script}
              onChange={(e) => setScript(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white outline-none focus:border-emerald-500 resize-none"
            />

            {/* Live Waveform Preview */}
            <div>
              <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                <span>Neural Audio Waveform</span>
                <span>{isPlayingPreview ? 'Synthesizing Stream...' : 'Idle'}</span>
              </div>
              <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-2 h-20 flex items-center justify-center">
                <canvas ref={canvasRef} width={480} height={70} className="w-full h-full" />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 border border-neutral-700"
              >
                {isPlayingPreview ? <Pause size={13} /> : <Play size={13} />}
                <span>{isPlayingPreview ? 'Stop Preview' : 'Test Acoustic Preview'}</span>
              </button>

              <button
                onClick={handleGenerateVoice}
                disabled={isGenerating}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition flex items-center gap-1.5 shadow-lg shadow-emerald-900/30"
              >
                <Sparkles size={14} />
                <span>{isGenerating ? 'Synthesizing...' : 'Generate Voiceover (10 Cr)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Persona, Modulators & Pronunciation Dictionary */}
        <div className="space-y-4">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 space-y-3 text-xs">
            <h3 className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">
              Voice Persona & Cadence
            </h3>

            <div>
              <label className="text-[10px] text-neutral-500 block mb-1">Speaker Model</label>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-white outline-none"
              >
                <option value="Baritone Commercial Master">Baritone Commercial Master (Deep, Warm)</option>
                <option value="Luxury Sophistication">Luxury Sophistication (Smooth, Intimate)</option>
                <option value="Energetic Tech Creator">Energetic Tech Creator (Crisp, Fast)</option>
                <option value="Cinematic Documentary">Cinematic Documentary (Solemn, Authoritative)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-neutral-500 block mb-1">Emotion Preset</label>
              <select
                value={emotion}
                onChange={(e) => setEmotion(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-white outline-none"
              >
                <option value="Confident & Measured">Confident & Measured</option>
                <option value="Dynamic & Inspirational">Dynamic & Inspirational</option>
                <option value="Quiet Luxury Whisper">Quiet Luxury Whisper</option>
                <option value="Urgent Action">Urgent Call to Action</option>
              </select>
            </div>

            <div className="space-y-2 pt-1">
              <div>
                <div className="flex justify-between text-[10px] text-neutral-400 mb-0.5">
                  <span>Speed</span>
                  <span className="font-mono">{speed.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.5"
                  step="0.05"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-neutral-400 mb-0.5">
                  <span>Pitch</span>
                  <span className="font-mono">{pitch > 0 ? `+${pitch}` : pitch} semitones</span>
                </div>
                <input
                  type="range"
                  min="-6"
                  max="6"
                  step="1"
                  value={pitch}
                  onChange={(e) => setPitch(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Pronunciation Dictionary */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 space-y-2.5 text-xs">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-neutral-400">
              <BookOpen size={13} className="text-blue-400" />
              <span>Pronunciation Dictionary</span>
            </div>

            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Word (e.g. Aura)"
                value={dictKey}
                onChange={(e) => setDictKey(e.target.value)}
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-white text-[11px] outline-none"
              />
              <input
                type="text"
                placeholder="Phonetic (AW-rah)"
                value={dictValue}
                onChange={(e) => setDictValue(e.target.value)}
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-white text-[11px] outline-none"
              />
              <button
                onClick={handleAddPronunciation}
                className="bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded transition"
              >
                <Plus size={13} />
              </button>
            </div>

            <div className="space-y-1 max-h-24 overflow-y-auto">
              {Object.entries(pronunciationDict).map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between bg-neutral-950 px-2 py-1 rounded text-[10px] font-mono text-neutral-300"
                >
                  <span className="text-white font-bold">{k}</span>
                  <span className="text-emerald-400">→ {v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
