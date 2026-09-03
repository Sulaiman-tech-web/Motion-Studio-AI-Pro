import { ProjectState, EditorState, AppState, BrandKitV2, CreativeBrief, StoryboardSceneV2 } from '../types';

export const initialBrandKit: BrandKitV2 = {
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
  pronunciationDictionary: {
    Aura: 'AW-rah',
    ANC: 'A-N-C',
    Pro: 'PRO'
  },
  colors: ['#ffffff', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'],
  defaultFont: 'system-ui, sans-serif'
};

export const initialCreativeBrief: CreativeBrief = {
  id: 'brief_aura_pro',
  projectObjective: 'Create a 15-second premium advertisement for Aura Pro wireless headphones highlighting ANC, 60hr battery, and sleek titanium design.',
  product: 'Aura Pro Wireless ANC Headphones',
  audience: 'Audiophiles, remote executives, and digital creators (22-40)',
  platform: 'Omni-channel',
  duration: 15,
  aspectRatio: '16:9',
  visualStyle: 'Dark luxury studio lighting with electric cobalt rim glow and titanium reflections',
  brandPersonality: 'Sophisticated, innovative, relentless focus',
  keyMessage: 'Silence the noise. Amplify your craft.',
  cta: 'Experience Pure Sound • Available Now',
  voiceStyle: 'Deep, measured, confident baritone',
  musicStyle: 'Minimalist tech electronic with sub-bass drop and crisp atmospheric transients',
  requiredAssets: 'Product Hero Cutout, Exploded Driver Chamber, Lifestyle B-roll',
  restrictions: 'Preserve safe margins, avoid harsh strobes, maintain 4.5:1 contrast'
};

export const initialStoryboardScenes: StoryboardSceneV2[] = [
  {
    id: 'sc_1',
    sceneNumber: 1,
    startSec: 0,
    endSec: 3,
    phase: 'Hook',
    title: 'The Macro Awakening',
    visualDescription: 'Macro reveal of the acoustic titanium mesh emerging from pure darkness with an electric rim light.',
    cameraDirection: 'Slow push-in with 10° clockwise camera drift',
    voiceover: 'Silence is not the absence of sound.',
    onScreenText: 'FEEL EVERY DETAIL',
    brollPrompt: 'Ferrofluid dancing on acoustic diaphragm in 120 FPS',
    musicDirection: 'Atmospheric sub-bass swell with crisp high chime',
    transition: 'cut',
    thumbnailUrl: '',
    status: 'ready'
  },
  {
    id: 'sc_2',
    sceneNumber: 2,
    startSec: 3,
    endSec: 7,
    phase: 'Feature',
    title: 'Adaptive Hybrid ANC',
    visualDescription: 'Exploded internal driver chamber with animated soundwave cancellation particles.',
    cameraDirection: 'Parallax pan right revealing internal acoustic chamber',
    voiceover: 'It is the precision of your world.',
    onScreenText: '40dB HYBRID NOISE CANCELLATION',
    brollPrompt: 'City traffic noise visual particles dissolving into smooth liquid blue',
    musicDirection: 'Percussive synth pulses enter at 128 BPM',
    transition: 'slide',
    thumbnailUrl: '',
    status: 'ready'
  },
  {
    id: 'sc_3',
    sceneNumber: 3,
    startSec: 7,
    endSec: 11,
    phase: 'Experience',
    title: 'Uncompromised Flow',
    visualDescription: 'Dynamic lifestyle shot of creator in modern sunlit studio moving effortlessly with zero wires.',
    cameraDirection: 'Smooth gimbal track around creator',
    voiceover: 'Designed for relentless focus, wherever your craft takes you.',
    onScreenText: '60-HOUR BATTERY LIFE',
    brollPrompt: 'Golden hour architectural reflections through floor-to-ceiling glass',
    musicDirection: 'Full harmonic synth drop with tight sub kick',
    transition: 'zoom',
    thumbnailUrl: '',
    status: 'ready'
  },
  {
    id: 'sc_4',
    sceneNumber: 4,
    startSec: 11,
    endSec: 15,
    phase: 'CTA',
    title: 'Brand Finale & Order',
    visualDescription: 'Hero product lockup on illuminated dark pedestal with glowing purchase button.',
    cameraDirection: 'Locked hero frame with subtle anamorphic lens flare',
    voiceover: 'Hear tomorrow, today. Available now.',
    onScreenText: 'EXPERIENCE PURE SOUND',
    brollPrompt: 'Titanium magnetic case snapping shut',
    musicDirection: 'Resonant brand logo sting with wide stereo reverb',
    transition: 'whoosh',
    thumbnailUrl: '',
    status: 'ready'
  }
];

export const initialProjectState: ProjectState = {
  id: 'proj_v6_aura',
  name: 'Aura Pro — AI Commercial Master',
  resolution: { w: 1920, h: 1080, label: '1080p Full HD', aspectRatio: '16:9' },
  fps: 60,
  duration: 15,
  brandKit: initialBrandKit,
  creativeBrief: initialCreativeBrief,
  storyboardScenes: initialStoryboardScenes,
  generatedAssets: [],
  layers: [
    {
      id: 'bg_1',
      name: 'Dark Studio Canvas',
      type: 'rect',
      baseProps: {
        x: 960,
        y: 540,
        width: 1920,
        height: 1080,
        fill: '#08080c',
        opacity: 1,
        rotation: 0,
        scale: 1
      },
      effects: { blur: 0, shadow: 0 },
      animations: {}
    },
    {
      id: 'shape_pedestal',
      name: 'Studio Pedestal Aura',
      type: 'circle',
      baseProps: {
        x: 960,
        y: 620,
        width: 680,
        height: 680,
        fill: 'transparent',
        stroke: '#3b82f6',
        strokeWidth: 4,
        borderRadius: '50%',
        opacity: 1,
        rotation: 0,
        scale: 1
      },
      effects: { blur: 0, shadow: 15, glow: 25 },
      animations: {
        scale: [
          { time: 0, value: 0.2, easing: 'easeOutBack' },
          { time: 1.5, value: 1 }
        ],
        rotation: [
          { time: 0, value: 0, easing: 'linear' },
          { time: 15, value: 360 }
        ]
      }
    },
    {
      id: 'txt_title',
      name: 'Hero Title',
      type: 'text',
      text: 'AURA PRO WIRELESS',
      baseProps: {
        x: 960,
        y: 490,
        width: 950,
        height: 140,
        fill: '#ffffff',
        fontSize: 90,
        fontWeight: '900',
        letterSpacing: '2px',
        opacity: 1,
        rotation: 0,
        scale: 1
      },
      effects: { blur: 0, shadow: 25, glow: 20 },
      animations: {
        y: [
          { time: 0.2, value: 560, easing: 'easeOutBack' },
          { time: 1.4, value: 490 }
        ],
        opacity: [
          { time: 0.2, value: 0, easing: 'linear' },
          { time: 0.9, value: 1 }
        ],
        scale: [
          { time: 0.2, value: 0.85, easing: 'easeOutBack' },
          { time: 1.4, value: 1 }
        ]
      }
    },
    {
      id: 'txt_sub',
      name: 'Key Message Tagline',
      type: 'text',
      text: 'SILENCE THE NOISE • AMPLIFY YOUR CRAFT',
      baseProps: {
        x: 960,
        y: 575,
        width: 780,
        height: 50,
        fill: '#60a5fa',
        fontSize: 22,
        fontWeight: '700',
        letterSpacing: '3px',
        opacity: 1,
        rotation: 0,
        scale: 1
      },
      effects: { blur: 0, shadow: 10 },
      animations: {
        opacity: [
          { time: 0.8, value: 0, easing: 'linear' },
          { time: 1.6, value: 1 }
        ]
      }
    }
  ]
};

export const initialEditorState: EditorState = {
  currentTime: 0,
  isPlaying: false,
  selectedLayerIds: ['txt_title'],
  zoom: 0.55,
  workspaceMode: 'CREATE',
  createSubTab: 'brief',
  activeTab: 'ai',
  showExportDialog: false,
  exportProgress: 0,
  autoKeyframe: true,
  renderCredits: 2850,
  previewQuality: 'half',
  highFpsMode: true,
  currentWorkers: [],
  generationJobs: [],
  beatSync: {
    enabled: true,
    bpm: 128,
    snapGrid: true
  },
  brandKit: initialBrandKit,
  batchDataset: [
    {
      id: 'batch_1',
      productName: 'Aura Pro Matte Black',
      price: '$349',
      headline: 'PREMIUM ACTIVE NOISE CANCELLATION',
      productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      cta: 'Buy Now • Free Shipping',
      color: '#0a0a0c',
      status: 'Ready'
    },
    {
      id: 'batch_2',
      productName: 'Aura Pro Glacier Silver',
      price: '$349',
      headline: 'AIRCRAFT-GRADE TITANIUM CHASSIS',
      productImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
      cta: 'Explore Glacier Edition',
      color: '#cbd5e1',
      status: 'Ready'
    },
    {
      id: 'batch_3',
      productName: 'Aura Pro Midnight Blue',
      price: '$379',
      headline: 'STUDIO-GRADE ACOUSTIC FIDELITY',
      productImage: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
      cta: 'Limited Edition • Order',
      color: '#1e3a8a',
      status: 'Ready'
    }
  ],
  variants: [
    {
      id: 'var_16_9',
      name: 'YouTube & TV Master',
      aspectRatio: '16:9',
      resolution: { w: 1920, h: 1080, label: '1080p Landscape', aspectRatio: '16:9' },
      enabled: true
    },
    {
      id: 'var_9_16',
      name: 'TikTok & Reels Vertical',
      aspectRatio: '9:16',
      resolution: { w: 1080, h: 1920, label: '1080p Vertical', aspectRatio: '9:16' },
      enabled: true
    },
    {
      id: 'var_1_1',
      name: 'Instagram Square Feed',
      aspectRatio: '1:1',
      resolution: { w: 1080, h: 1080, label: 'Square 1:1', aspectRatio: '1:1' },
      enabled: true
    },
    {
      id: 'var_4_5',
      name: 'Social Portrait 4:5',
      aspectRatio: '4:5',
      resolution: { w: 1080, h: 1350, label: 'Portrait 4:5', aspectRatio: '4:5' },
      enabled: false
    }
  ],
  exportHistory: []
};

export const initialState: AppState = {
  past: [],
  present: { project: initialProjectState, editor: initialEditorState },
  future: []
};
