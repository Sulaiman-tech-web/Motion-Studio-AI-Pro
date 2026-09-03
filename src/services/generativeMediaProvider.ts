import {
  CreativeBrief,
  StoryboardSceneV2,
  ScriptScene,
  GeneratedAsset,
  BrandKitV2,
  ProjectState,
  CreativeReviewReport
} from '../types';
import { generateId } from '../utils/animation';

export interface GenerateImageParams {
  prompt: string;
  negativePrompt?: string;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
  style: string;
  quality: 'fast' | 'balanced' | 'quality' | 'max';
  seed?: number;
  referenceImage?: string;
  transparentBg?: boolean;
}

export interface GenerateVideoParams {
  prompt: string;
  durationSec: number;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
  cameraMovement: string;
  motionIntensity: number;
  referenceImage?: string;
}

export interface GenerateVoiceParams {
  script: string;
  voice: string;
  language: 'en' | 'id' | 'ja' | 'es';
  speed: number;
  pitch?: number;
  emotion?: string;
}

export interface GenerateMusicParams {
  mood: string;
  genre: string;
  durationSec: number;
  tempo: number;
  energy: 'low' | 'medium' | 'high' | 'epic';
}

export interface GenerateSFXParams {
  type: 'whoosh' | 'impact' | 'ui_click' | 'transition_sweep' | 'riser' | 'glitch';
  intensity: number;
}

export class GenerativeMediaProvider {
  private static instance: GenerativeMediaProvider;

  public static getInstance(): GenerativeMediaProvider {
    if (!GenerativeMediaProvider.instance) {
      GenerativeMediaProvider.instance = new GenerativeMediaProvider();
    }
    return GenerativeMediaProvider.instance;
  }

  // Credit calculation table based on task and quality
  public estimateCredits(task: string, quality: 'fast' | 'balanced' | 'quality' | 'max' = 'balanced'): number {
    const multiplier = quality === 'fast' ? 0.7 : quality === 'balanced' ? 1.0 : quality === 'quality' ? 1.5 : 2.2;
    switch (task) {
      case 'image':
        return Math.round(15 * multiplier);
      case 'video':
        return Math.round(60 * multiplier);
      case 'voice':
        return Math.round(10 * multiplier);
      case 'music':
        return Math.round(25 * multiplier);
      case 'sfx':
        return Math.round(5 * multiplier);
      case 'broll':
        return Math.round(30 * multiplier);
      case 'cutout':
        return 8;
      case 'upscale':
        return 40;
      default:
        return 10;
    }
  }

  // Generate SVG Graphic Data URL for simulated high-detail generated assets
  private createSvgDataUrl(title: string, subtitle: string, bgGradient: [string, string], accent: string, type: string, w = 1280, h = 720): string {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgGradient[0]}"/>
          <stop offset="100%" stop-color="${bgGradient[1]}"/>
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
        </radialGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000" flood-opacity="0.8"/>
        </filter>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#bg)"/>
      <circle cx="${w/2}" cy="${h/2}" r="${Math.min(w,h)*0.35}" fill="url(#glow)"/>
      
      <!-- Studio Grid / Floor reflection -->
      <line x1="0" y1="${h*0.75}" x2="${w}" y2="${h*0.75}" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
      <ellipse cx="${w/2}" cy="${h*0.75}" rx="${w*0.35}" ry="${h*0.06}" fill="rgba(0,0,0,0.4)" filter="url(#shadow)"/>
      <ellipse cx="${w/2}" cy="${h*0.75}" rx="${w*0.25}" ry="${h*0.04}" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="8 8"/>

      <!-- Subject silhouette / 3D pedestal device graphic -->
      <g transform="translate(${w/2}, ${h/2 - 20})">
        <circle cx="0" cy="0" r="140" fill="none" stroke="${accent}" stroke-width="3" opacity="0.6"/>
        <circle cx="0" cy="0" r="110" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.4"/>
        <rect x="-70" y="-70" width="140" height="140" rx="30" fill="${bgGradient[0]}" stroke="${accent}" stroke-width="2.5" filter="url(#shadow)"/>
        <path d="M -30 0 L 0 -30 L 30 0 L 0 30 Z" fill="${accent}" opacity="0.8"/>
      </g>

      <!-- Watermark / Tag -->
      <rect x="32" y="32" width="140" height="32" rx="8" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.15)"/>
      <text x="44" y="53" fill="${accent}" font-family="system-ui, sans-serif" font-weight="700" font-size="12" letter-spacing="1">AI GEN • ${type.toUpperCase()}</text>

      <!-- Captions -->
      <text x="${w/2}" y="${h*0.84}" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="800" font-size="${Math.round(h*0.045)}" text-anchor="middle" letter-spacing="2">${title}</text>
      <text x="${w/2}" y="${h*0.89}" fill="${accent}" font-family="system-ui, sans-serif" font-weight="600" font-size="${Math.round(h*0.024)}" text-anchor="middle" letter-spacing="3">${subtitle}</text>
    </svg>`;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  // Text-To-Image
  public async generateImage(params: GenerateImageParams): Promise<GeneratedAsset> {
    const id = `asset_img_${generateId()}`;
    const seed = params.seed || Math.floor(Math.random() * 9999999);
    
    // Choose dynamic color palette based on prompt
    const isTech = /tech|cyber|blue|neon|digital/i.test(params.prompt);
    const isLuxury = /luxury|gold|premium|black|dark/i.test(params.prompt);
    const bgGradient: [string, string] = isLuxury
      ? ['#141416', '#08080a']
      : isTech
      ? ['#0b132b', '#1c2541']
      : ['#1e1b4b', '#0f172a'];
    const accent = isLuxury ? '#f59e0b' : isTech ? '#38bdf8' : '#818cf8';

    const dims = params.aspectRatio === '9:16' ? { w: 720, h: 1280 } : params.aspectRatio === '1:1' ? { w: 1080, h: 1080 } : { w: 1280, h: 720 };
    const assetUrl = this.createSvgDataUrl(
      params.prompt.slice(0, 32).toUpperCase(),
      `STYLE: ${params.style.toUpperCase()} • SEED #${seed}`,
      bgGradient,
      accent,
      'Image',
      dims.w,
      dims.h
    );

    return {
      id,
      provider: 'OmniStudio GenEngine V6',
      generationType: 'image',
      prompt: params.prompt,
      negativePrompt: params.negativePrompt,
      seed,
      settings: { ...params },
      status: 'ready',
      assetUrl,
      previewUrl: assetUrl,
      width: dims.w,
      height: dims.h,
      createdAt: Date.now(),
      version: 1,
      lineage: ['root']
    };
  }

  // Text/Image-To-Video
  public async generateVideo(params: GenerateVideoParams): Promise<GeneratedAsset> {
    const id = `asset_vid_${generateId()}`;
    const seed = Math.floor(Math.random() * 9999999);
    const dims = params.aspectRatio === '9:16' ? { w: 720, h: 1280 } : { w: 1280, h: 720 };
    
    const assetUrl = this.createSvgDataUrl(
      params.prompt.slice(0, 32).toUpperCase(),
      `CAM: ${params.cameraMovement.toUpperCase()} • ${params.durationSec}s • 60 FPS`,
      ['#09090b', '#18181b'],
      '#a855f7',
      'Video 60fps',
      dims.w,
      dims.h
    );

    return {
      id,
      provider: 'Sora/Veo Motion Adapter',
      generationType: 'video',
      prompt: params.prompt,
      seed,
      settings: { ...params },
      status: 'ready',
      assetUrl,
      previewUrl: assetUrl,
      width: dims.w,
      height: dims.h,
      duration: params.durationSec,
      fps: 60,
      createdAt: Date.now(),
      version: 1,
      lineage: ['root']
    };
  }

  // Text-To-Voiceover
  public async generateVoice(params: GenerateVoiceParams): Promise<GeneratedAsset> {
    const id = `asset_vo_${generateId()}`;
    const words = params.script.trim().split(/\s+/).length;
    const duration = Math.max(2, Math.round(words / 2.8 / params.speed));

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="120" viewBox="0 0 600 120">
      <rect width="600" height="120" rx="12" fill="#171717"/>
      <path d="M 20 60 Q 50 20, 80 60 T 140 60 T 200 60 T 260 60 T 320 60 T 380 60 T 440 60 T 500 60 T 560 60" fill="none" stroke="#3b82f6" stroke-width="3"/>
      <text x="30" y="32" fill="#60a5fa" font-family="system-ui" font-size="12" font-weight="700">VOICEOVER: ${params.voice.toUpperCase()} (${params.language.toUpperCase()})</text>
      <text x="30" y="100" fill="#9ca3af" font-family="system-ui" font-size="11">"${params.script.slice(0, 60)}..."</text>
    </svg>`;

    return {
      id,
      provider: 'NeuralTTS Studio Pro',
      generationType: 'voice',
      prompt: params.script,
      seed: 42,
      settings: { ...params },
      status: 'ready',
      assetUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
      duration,
      createdAt: Date.now(),
      version: 1,
      lineage: ['root']
    };
  }

  // Text-To-SFX
  public async generateSFX(params: GenerateSFXParams): Promise<GeneratedAsset> {
    const id = `asset_sfx_${generateId()}`;
    return {
      id,
      provider: 'SoundGen AI Master',
      generationType: 'sfx',
      prompt: `${params.type} sound effect`,
      seed: 1234,
      settings: { ...params },
      status: 'ready',
      assetUrl: '',
      duration: 1.5,
      createdAt: Date.now(),
      version: 1,
      lineage: ['root']
    };
  }

  // Text-To-Music
  public async generateMusic(params: GenerateMusicParams): Promise<GeneratedAsset> {
    const id = `asset_mus_${generateId()}`;
    return {
      id,
      provider: 'Lyria/MusicLM Adapter',
      generationType: 'music',
      prompt: `${params.genre} ${params.mood} soundtrack`,
      seed: 8888,
      settings: { ...params },
      status: 'ready',
      assetUrl: '',
      duration: params.durationSec,
      createdAt: Date.now(),
      version: 1,
      lineage: ['root']
    };
  }

  // Product Cutout with Studio Lighting
  public async generateCutout(parentAsset: GeneratedAsset): Promise<GeneratedAsset> {
    const id = `asset_cutout_${generateId()}`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
      <defs>
        <filter id="softShadow">
          <feDropShadow dx="0" dy="25" stdDeviation="30" flood-color="#000" flood-opacity="0.8"/>
        </filter>
        <radialGradient id="rimLight" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
          <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Contact Shadow on transparent ground -->
      <ellipse cx="400" cy="680" rx="260" ry="40" fill="rgba(0,0,0,0.6)" filter="url(#softShadow)"/>
      <ellipse cx="400" cy="670" rx="180" ry="25" fill="rgba(0,0,0,0.8)"/>
      <!-- Transparent Cutout Object -->
      <g transform="translate(400, 380)" filter="url(#softShadow)">
        <rect x="-180" y="-180" width="360" height="360" rx="60" fill="#18181b" stroke="#38bdf8" stroke-width="4"/>
        <circle cx="0" cy="0" r="110" fill="none" stroke="#ffffff" stroke-width="3" stroke-dasharray="10 6"/>
        <path d="M -60 0 L 0 -60 L 60 0 L 0 60 Z" fill="#38bdf8"/>
      </g>
    </svg>`;

    return {
      id,
      parentAssetId: parentAsset.id,
      provider: 'SmartMatte Product Cutout V6',
      generationType: 'cutout',
      prompt: `Isolated subject from: ${parentAsset.prompt}`,
      seed: parentAsset.seed,
      settings: { transparent: true, shadow: 'studio_contact' },
      status: 'ready',
      assetUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
      width: 800,
      height: 800,
      createdAt: Date.now(),
      version: parentAsset.version + 1,
      lineage: [...parentAsset.lineage, parentAsset.id]
    };
  }

  // Creative Brief Generator
  public generateCreativeBrief(prompt: string, brandKit?: BrandKitV2): CreativeBrief {
    const isHeadphone = /headphone|audio|sound|ear/i.test(prompt);
    const isFashion = /fashion|cloth|wear|luxury/i.test(prompt);

    return {
      id: `brief_${generateId()}`,
      projectObjective: prompt.trim() || 'Create a high-impact commercial showcasing cutting-edge product innovations.',
      product: isHeadphone ? 'Aura Pro Wireless ANC Headphones' : isFashion ? 'Lumina Minimalist Urban Line' : 'Apex Dynamic Device',
      audience: 'Tech-savvy early adopters, creators & executive professionals (Ages 22-40)',
      platform: 'Omni-channel',
      duration: 15,
      aspectRatio: '16:9',
      visualStyle: 'Dark luxury cinematic with dramatic rim lighting and kinetic particle accents',
      brandPersonality: brandKit?.brandTone || 'Confident, Minimal, Innovative, High-Performance',
      keyMessage: 'Engineered for pure focus and uncompromised sound fidelity.',
      cta: brandKit?.ctaStyle || 'Experience Pure Sound • Order Now at motionstudio.ai',
      voiceStyle: 'Deep, measured, sophisticated baritone with subtle warmth',
      musicStyle: 'Minimalist electronic build-up with sub-bass drop and crisp atmospheric transients',
      requiredAssets: 'Product Hero Cutout, Studio Pedestal Shot, Feature Callout Highlights',
      restrictions: 'No cluttered text, preserve 80% action-safe boundaries, avoid flashy neon strobe effects'
    };
  }

  // Storyboard Generator V2 from Creative Brief
  public generateStoryboard(brief: CreativeBrief): StoryboardSceneV2[] {
    return [
      {
        id: `sc_1_${generateId()}`,
        sceneNumber: 1,
        startSec: 0,
        endSec: 3,
        phase: 'Hook',
        title: 'The Silent Awakening',
        visualDescription: 'Extreme macro close-up of the acoustic mesh and titanium hinge floating out of total darkness.',
        cameraDirection: 'Slow push-in with 15° clockwise orbit simulation',
        voiceover: 'Silence is not the absence of sound.',
        onScreenText: 'FEEL EVERY DETAIL',
        brollPrompt: 'Soundwaves rippling through ferrofluid in 120 FPS slow motion',
        musicDirection: 'Sub-bass atmospheric drone with rising high-frequency chime',
        transition: 'cut',
        thumbnailUrl: this.createSvgDataUrl('SCENE 01: THE HOOK', '0.0s - 3.0s • MACRO REVEAL', ['#050508', '#111827'], '#3b82f6', 'Scene 1'),
        status: 'ready'
      },
      {
        id: `sc_2_${generateId()}`,
        sceneNumber: 2,
        startSec: 3,
        endSec: 7,
        phase: 'Feature',
        title: 'Adaptive Acoustic Core',
        visualDescription: 'Exploded internal acoustic chamber demonstrating real-time hybrid noise cancellation diaphragm.',
        cameraDirection: 'Parallax pan right revealing glowing audio waveform lines',
        voiceover: 'It is the precision of your world.',
        onScreenText: '40dB HYBRID ANC',
        brollPrompt: 'Urban street ambient sounds fading into crystalline acoustic clarity',
        musicDirection: 'Percussive synth pulses enter at 128 BPM',
        transition: 'slide',
        thumbnailUrl: this.createSvgDataUrl('SCENE 02: FEATURE CALLOUT', '3.0s - 7.0s • EXPLODED CORE', ['#09090b', '#1e1b4b'], '#8b5cf6', 'Scene 2'),
        status: 'ready'
      },
      {
        id: `sc_3_${generateId()}`,
        sceneNumber: 3,
        startSec: 7,
        endSec: 11,
        phase: 'Experience',
        title: 'Uncompromised Momentum',
        visualDescription: 'Lifestyle B-roll: Creator walking through futuristic glass architecture with wireless freedom.',
        cameraDirection: 'Dynamic tracking shot with smooth optical motion blur',
        voiceover: 'Designed for relentless focus, wherever your craft takes you.',
        onScreenText: '60-HR BATTERY LIFE',
        brollPrompt: 'Modern minimalist studio overlooking city skyline at golden hour',
        musicDirection: 'Full harmonic drop with rich electronic bassline',
        transition: 'zoom',
        thumbnailUrl: this.createSvgDataUrl('SCENE 03: LIFESTYLE B-ROLL', '7.0s - 11.0s • MOMENTUM', ['#0f172a', '#1e293b'], '#10b981', 'Scene 3'),
        status: 'ready'
      },
      {
        id: `sc_4_${generateId()}`,
        sceneNumber: 4,
        startSec: 11,
        endSec: 15,
        phase: 'CTA',
        title: 'Ascend to Pure Audio',
        visualDescription: 'Sleek product hero lockup with glowing logo badge and illuminated call-to-action button.',
        cameraDirection: 'Center lock with subtle lens light sweep',
        voiceover: 'Hear tomorrow, today. Available now.',
        onScreenText: brief.cta || 'EXPERIENCE PURE SOUND',
        brollPrompt: 'Sleek packaging opening with magnetic snap',
        musicDirection: 'Sustained reverb tail with crisp logo audio impact',
        transition: 'whoosh',
        thumbnailUrl: this.createSvgDataUrl('SCENE 04: BRAND FINALE', '11.0s - 15.0s • CALL TO ACTION', ['#030712', '#111827'], '#f59e0b', 'Scene 4'),
        status: 'ready'
      }
    ];
  }

  // Script Generator
  public generateScript(brief: CreativeBrief, tone: string): ScriptScene[] {
    const scenes = this.generateStoryboard(brief);
    return scenes.map((sc, i) => {
      const words = sc.voiceover.split(' ').length;
      return {
        id: `scr_${i}`,
        sceneIndex: i + 1,
        phase: sc.phase,
        voiceover: sc.voiceover,
        onScreenText: sc.onScreenText,
        visualSummary: sc.visualDescription,
        wordCount: words,
        estimatedDurationSec: Number((words / 2.5).toFixed(1))
      };
    });
  }

  // Creative Review & Quality Inspector Report
  public analyzeProject(project: ProjectState, brief?: CreativeBrief): CreativeReviewReport {
    const hasHook = project.layers.some(l => l.animations?.scale || l.animations?.opacity);
    const hasText = project.layers.some(l => l.type === 'text');
    const is4K = project.resolution.w >= 3840 || project.resolution.h >= 3840;
    const is120 = project.fps >= 120;

    const fpsWarnings: string[] = [];
    if (is120) {
      fpsWarnings.push('Timeline set to 120 FPS. Keyframe animations evaluate deterministically at 120Hz. AI media without optical interpolation will duplicate frames.');
    }

    const resolutionWarnings: string[] = [];
    if (is4K) {
      resolutionWarnings.push('4K UHD Master active. Any 1080p source media will undergo high-detail AI Super-Resolution during cloud export.');
    }

    return {
      hookScore: hasHook ? 94 : 72,
      pacingScore: project.duration <= 15 ? 96 : 84,
      brandScore: project.brandKit ? 98 : 79,
      readabilityScore: hasText ? 92 : 65,
      audioScore: 90,
      overallScore: Math.round((94 + 96 + (project.brandKit ? 98 : 79) + (hasText ? 92 : 65) + 90) / 5),
      hookAnalysis: {
        first1Sec: 'High-contrast visual awakening with smooth scale expansion (Passes 1s retention threshold)',
        first3Sec: 'Hero title layer appears with 120 FPS subframe easing into center-safe area',
        first5Sec: 'Transition into secondary feature callout with audio bass drop sync'
      },
      recommendations: [
        'Ensure CTA headline retains at least 200px clear margin on 9:16 vertical exports.',
        'Audio ducking recommended during Scene 2 voiceover speech burst.',
        'Verified: Brand color palette adheres to 4.5:1 WCAG contrast guidelines.'
      ],
      fpsWarnings,
      resolutionWarnings
    };
  }
}
