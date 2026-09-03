export type LayerType = 'rect' | 'text' | 'circle' | 'image' | 'video' | 'caption' | 'audio';

export type EasingType =
  | 'linear'
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInOutQuad'
  | 'easeOutBack'
  | 'bounce';

export interface Keyframe {
  time: number;
  value: number;
  easing?: EasingType;
}

export type AnimationTrack = Keyframe[];

export type Animations = Record<string, AnimationTrack>;

export interface BaseProps {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: string;
  opacity: number;
  rotation: number;
  scale: number;
  fontSize?: number;
  fontWeight?: string;
  letterSpacing?: string;
  src?: string;
  [key: string]: any;
}

export interface LayerEffects {
  blur?: number;
  shadow?: number;
  glow?: number;
}

export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  text?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  volume?: number;
  isBroll?: boolean;
  baseProps: BaseProps;
  effects: LayerEffects;
  animations: Animations;
  visible?: boolean;
  locked?: boolean;
  provenance?: 'native' | 'ai_generated' | 'interpolated' | 'upscaled';
  sourceFps?: number;
  nativeResolution?: { w: number; h: number };
}

export interface Resolution {
  w: number;
  h: number;
  label?: string;
  aspectRatio?: string;
}

export type ExportFormat = 'mp4' | 'webm' | 'gif' | 'png_sequence' | 'json';
export type ExportQuality = 'draft' | 'standard' | 'high' | 'ultra' | 'master';
export type RenderMode = 'auto' | 'local' | 'high_perf' | 'cloud_gpu';
export type ColorProfile = 'sRGB' | 'Rec.709' | 'Display P3';

export interface ExportConfig {
  format: ExportFormat;
  codec: string;
  resolution: Resolution;
  fps: number;
  quality: ExportQuality;
  bitrateMode: 'auto' | 'constant' | 'target' | 'high' | 'custom';
  customBitrateMbps?: number;
  audioCodec: 'aac' | 'opus' | 'pcm';
  audioSampleRate: 44100 | 48000 | 96000;
  audioBitrateKbps: 128 | 192 | 256 | 320;
  colorProfile: ColorProfile;
  alpha: boolean;
  renderMode: RenderMode;
  motionBlur: {
    enabled: boolean;
    shutterAngle: number;
    samples: number;
  };
}

export interface ExportHistoryItem {
  id: string;
  projectName: string;
  timestamp: number;
  resolution: Resolution;
  fps: number;
  format: ExportFormat;
  codec: string;
  fileSize: string;
  duration: number;
  status: 'completed' | 'rendering' | 'failed';
  downloadUrl?: string;
  settings: ExportConfig;
  validation?: {
    durationOk: boolean;
    frameCountOk: boolean;
    resolutionOk: boolean;
    previewThumbnails: string[];
  };
}

export interface RenderWorkerProgress {
  id: string;
  name: string;
  frameStart: number;
  frameEnd: number;
  currentFrame: number;
  status: 'idle' | 'rendering' | 'encoding' | 'completed' | 'failed';
}

// V6 AI CREATIVE PRODUCTION MODELS
export interface CreativeBrief {
  id: string;
  projectObjective: string;
  product: string;
  audience: string;
  platform: 'TikTok' | 'Instagram Reels' | 'YouTube' | 'Landscape Ad' | 'Omni-channel';
  duration: number;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
  visualStyle: string;
  brandPersonality: string;
  keyMessage: string;
  cta: string;
  voiceStyle: string;
  musicStyle: string;
  requiredAssets: string;
  restrictions: string;
}

export interface StoryboardScene {
  id: string;
  title: string;
  phase: 'Hook' | 'Reveal' | 'Core' | 'Outro';
  duration: number;
  description: string;
  motionStyle: string;
}

export interface StoryboardSceneV2 {
  id: string;
  sceneNumber: number;
  startSec: number;
  endSec: number;
  phase: 'Hook' | 'Feature' | 'Experience' | 'CTA';
  title: string;
  visualDescription: string;
  cameraDirection: string;
  voiceover: string;
  onScreenText: string;
  brollPrompt: string;
  musicDirection: string;
  transition: 'cut' | 'fade' | 'slide' | 'zoom' | 'whoosh';
  thumbnailUrl: string;
  status: 'ready' | 'generating' | 'approved';
  generatedAssetRefs?: string[];
}

export interface ScriptScene {
  id: string;
  sceneIndex: number;
  phase: 'Hook' | 'Feature' | 'Experience' | 'CTA';
  voiceover: string;
  onScreenText: string;
  visualSummary: string;
  wordCount: number;
  estimatedDurationSec: number;
}

export interface GeneratedAsset {
  id: string;
  parentAssetId?: string;
  provider: string;
  generationType: 'image' | 'video' | 'voice' | 'music' | 'sfx' | 'broll' | 'cutout';
  prompt: string;
  negativePrompt?: string;
  seed: number;
  settings: Record<string, any>;
  status: 'queued' | 'generating' | 'ready' | 'failed';
  assetUrl: string;
  previewUrl?: string;
  width?: number;
  height?: number;
  duration?: number;
  fps?: number;
  createdAt: number;
  version: number;
  lineage: string[];
}

export interface GenerationJob {
  id: string;
  assetId: string;
  type: string;
  prompt: string;
  status: 'queued' | 'generating' | 'processing' | 'complete' | 'failed' | 'cancelled';
  progress: number;
  creditCost: number;
  startedAt: number;
  error?: string;
}

export interface BrandMotionDNA {
  style: 'Minimal' | 'Smooth' | 'Energetic' | 'Cinematic';
  easing: EasingType;
  transitions: string;
  rotation: 'Low' | 'Medium' | 'High';
  bounce: boolean;
  textAnimation: 'Fade / Tracking' | 'Scale Pop' | 'Kinetic Slide' | 'Glow Reveal';
}

export interface BrandKitV2 {
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headlineFont: string;
  bodyFont: string;
  brandTone: string;
  ctaStyle: string;
  motionDNA: BrandMotionDNA;
  restrictedWords: string[];
  pronunciationDictionary: Record<string, string>;
  colors: string[];
  defaultFont: string;
}

export interface BatchDatasetRow {
  id: string;
  productName: string;
  price: string;
  headline: string;
  productImage: string;
  cta: string;
  color?: string;
  status: 'Ready' | 'Invalid' | 'Queued' | 'Rendering' | 'Complete' | 'Failed';
  duration?: number;
}

export interface MultiFormatVariant {
  id: string;
  name: string;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
  resolution: Resolution;
  headlineOverride?: string;
  ctaOverride?: string;
  enabled: boolean;
}

export interface CreativeReviewReport {
  hookScore: number;
  pacingScore: number;
  brandScore: number;
  readabilityScore: number;
  audioScore: number;
  overallScore: number;
  hookAnalysis: {
    first1Sec: string;
    first3Sec: string;
    first5Sec: string;
  };
  recommendations: string[];
  fpsWarnings: string[];
  resolutionWarnings: string[];
}

export interface ProjectState {
  id: string;
  name: string;
  resolution: Resolution;
  fps: number;
  duration: number;
  layers: Layer[];
  brandKit?: BrandKitV2;
  creativeBrief?: CreativeBrief;
  storyboardScenes?: StoryboardSceneV2[];
  generatedAssets?: GeneratedAsset[];
}

export type WorkspaceMode =
  | 'CREATE'
  | 'VIDEO'
  | 'MOTION'
  | 'COLOR'
  | 'AUDIO'
  | 'CAPTIONS'
  | 'EXPORT';

export type CreateSubTab =
  | 'brief'
  | 'storyboard'
  | 'script'
  | 'media'
  | 'voice'
  | 'audio'
  | 'autobuild'
  | 'brand'
  | 'variants'
  | 'batch'
  | 'stock'
  | 'review';

export interface EditorState {
  currentTime: number;
  isPlaying: boolean;
  selectedLayerIds: string[];
  zoom: number;
  previewQuality: 'quarter' | 'half' | 'full';
  workspaceMode: WorkspaceMode;
  createSubTab: CreateSubTab;
  activeTab: 'ai' | 'storyboard' | 'layers' | 'properties' | 'templates' | 'brand';
  showExportDialog: boolean;
  exportProgress: number;
  autoKeyframe: boolean;
  highFpsMode: boolean;
  renderCredits: number;
  exportHistory: ExportHistoryItem[];
  currentWorkers: RenderWorkerProgress[];
  generationJobs: GenerationJob[];
  beatSync: {
    enabled: boolean;
    bpm: number;
    pulseActive?: boolean;
    snapGrid?: boolean;
  };
  brandKit?: BrandKitV2;
  batchDataset: BatchDatasetRow[];
  variants: MultiFormatVariant[];
}

export interface AppState {
  past: ProjectState[];
  present: {
    project: ProjectState;
    editor: EditorState;
  };
  future: ProjectState[];
}

export type EditorAction =
  | { type: 'TOGGLE_PLAY' }
  | { type: 'SET_TIME'; payload: number }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'SET_PREVIEW_QUALITY'; payload: 'quarter' | 'half' | 'full' }
  | { type: 'SELECT_LAYER'; payload: string }
  | { type: 'SET_WORKSPACE_MODE'; payload: WorkspaceMode }
  | { type: 'SET_CREATE_SUB_TAB'; payload: CreateSubTab }
  | { type: 'SET_ACTIVE_TAB'; payload: 'ai' | 'storyboard' | 'layers' | 'properties' | 'templates' | 'brand' }
  | { type: 'TOGGLE_EXPORT'; payload: boolean }
  | { type: 'SET_EXPORT_PROGRESS'; payload: number }
  | { type: 'TOGGLE_AUTO_KEYFRAME' }
  | { type: 'ADD_LAYER'; payload: Layer }
  | { type: 'DELETE_LAYER'; payload?: string }
  | { type: 'DUPLICATE_LAYER'; payload?: string }
  | { type: 'REORDER_LAYERS'; payload: { sourceIndex: number; targetIndex: number } }
  | { type: 'UPDATE_PROJECT_NAME'; payload: string }
  | { type: 'UPDATE_PROJECT_SETTINGS'; payload: Partial<Pick<ProjectState, 'resolution' | 'fps' | 'duration' | 'brandKit'>> }
  | { type: 'TOGGLE_LAYER_VISIBILITY'; payload: string }
  | {
      type: 'COMMIT_PROPERTY';
      payload: {
        id: string;
        prop: string;
        value: any;
        time: number;
        isAutoKeyframe?: boolean;
        isEffect?: boolean;
      };
    }
  | { type: 'APPLY_AI_MOTION'; payload: { id: string; animations: Animations } }
  | { type: 'CLEAR_ANIMATIONS'; payload: { id: string; prop?: string } }
  | { type: 'LOAD_PROJECT'; payload: ProjectState }
  | { type: 'APPLY_STORYBOARD'; payload: ProjectState }
  | {
      type: 'RESPONSIVE_RESIZE';
      payload: {
        targetResolution: Resolution;
        scaleFactors: { scaleX: number; scaleY: number };
      };
    }
  | { type: 'ADD_EXPORT_HISTORY'; payload: ExportHistoryItem }
  | { type: 'SET_RENDER_WORKERS'; payload: RenderWorkerProgress[] }
  | { type: 'DEDUCT_CREDITS'; payload: number }
  | { type: 'TOGGLE_BEAT_SYNC'; payload?: { enabled?: boolean; bpm?: number } }
  | {
      type: 'UPDATE_BEAT_SYNC';
      payload: Partial<{ enabled: boolean; bpm: number; pulseActive: boolean; snapGrid: boolean }>;
    }
  | {
      type: 'SET_BRAND_KIT';
      payload: Partial<BrandKitV2>;
    }
  | { type: 'UPDATE_CREATIVE_BRIEF'; payload: Partial<CreativeBrief> }
  | { type: 'SET_STORYBOARD_SCENES'; payload: StoryboardSceneV2[] }
  | { type: 'UPDATE_STORYBOARD_SCENE'; payload: { id: string; updates: Partial<StoryboardSceneV2> } }
  | { type: 'ADD_GENERATED_ASSET'; payload: GeneratedAsset }
  | { type: 'ADD_GENERATION_JOB'; payload: GenerationJob }
  | { type: 'UPDATE_GENERATION_JOB'; payload: { id: string; updates: Partial<GenerationJob> } }
  | { type: 'UPDATE_BATCH_ROW'; payload: { id: string; updates: Partial<BatchDatasetRow> } }
  | { type: 'SET_BATCH_DATASET'; payload: BatchDatasetRow[] }
  | { type: 'UPDATE_VARIANT'; payload: { id: string; updates: Partial<MultiFormatVariant> } }
  | { type: 'AUTO_BUILD_TIMELINE'; payload: { scenes: StoryboardSceneV2[]; level: 'light' | 'standard' | 'full' } }
  | { type: 'UNDO' }
  | { type: 'REDO' };
