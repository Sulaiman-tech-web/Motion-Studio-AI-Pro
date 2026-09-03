import { Resolution, ExportConfig, ExportQuality, RenderMode, ProjectState } from '../types';

export interface ResolutionPreset {
  id: string;
  name: string;
  category: 'Standard 16:9' | 'Cinema' | 'Vertical (Social)' | 'Square' | 'Custom';
  w: number;
  h: number;
  aspectRatio: string;
  recommendedFps?: number[];
  is4K?: boolean;
}

export const RESOLUTION_PRESETS: ResolutionPreset[] = [
  // Standard 16:9
  { id: '720p', name: 'HD 720p', category: 'Standard 16:9', w: 1280, h: 720, aspectRatio: '16:9', recommendedFps: [30, 60] },
  { id: '1080p', name: 'Full HD 1080p', category: 'Standard 16:9', w: 1920, h: 1080, aspectRatio: '16:9', recommendedFps: [30, 60, 120] },
  { id: '1440p', name: 'QHD 1440p', category: 'Standard 16:9', w: 2560, h: 1440, aspectRatio: '16:9', recommendedFps: [60, 120] },
  { id: '4k_uhd', name: 'UHD 4K', category: 'Standard 16:9', w: 3840, h: 2160, aspectRatio: '16:9', recommendedFps: [30, 60, 120], is4K: true },

  // Cinema & Ultrawide
  { id: '2k_dci', name: '2K DCI Cinema', category: 'Cinema', w: 2048, h: 1080, aspectRatio: '17:9', recommendedFps: [24, 48, 60] },
  { id: '2_5k', name: '2.5K WQXGA', category: 'Cinema', w: 2560, h: 1600, aspectRatio: '16:10', recommendedFps: [30, 60] },
  { id: '4k_dci', name: 'DCI 4K Cinema', category: 'Cinema', w: 4096, h: 2160, aspectRatio: '17:9', recommendedFps: [24, 60, 120], is4K: true },

  // Vertical Social
  { id: 'vert_1080p', name: 'Vertical 1080p (Reels/TikTok)', category: 'Vertical (Social)', w: 1080, h: 1920, aspectRatio: '9:16', recommendedFps: [30, 60] },
  { id: 'vert_1440p', name: 'Vertical 1440p High-Res', category: 'Vertical (Social)', w: 1440, h: 2560, aspectRatio: '9:16', recommendedFps: [60, 120] },
  { id: 'vert_4k', name: 'Vertical 4K Master', category: 'Vertical (Social)', w: 2160, h: 3840, aspectRatio: '9:16', recommendedFps: [60, 120], is4K: true },

  // Square
  { id: 'sq_1080', name: 'Square 1080p (Feed)', category: 'Square', w: 1080, h: 1080, aspectRatio: '1:1', recommendedFps: [30, 60] },
  { id: 'sq_1440', name: 'Square 1440p Creator', category: 'Square', w: 1440, h: 1440, aspectRatio: '1:1', recommendedFps: [60, 120] },
  { id: 'sq_4k', name: 'Square 4K Studio', category: 'Square', w: 2160, h: 2160, aspectRatio: '1:1', recommendedFps: [60, 120], is4K: true }
];

export const FRAME_RATES: number[] = [24, 25, 30, 48, 50, 60, 90, 100, 120];

export interface QuickPreset {
  id: string;
  name: string;
  description: string;
  category: 'Social' | 'YouTube' | 'Cinema' | 'Master';
  badge: string;
  config: Partial<ExportConfig>;
}

export const QUICK_EXPORT_PRESETS: QuickPreset[] = [
  {
    id: 'tiktok_1080p60',
    name: 'TikTok 1080p60',
    description: 'High-speed vertical short video optimized for TikTok algorithm',
    category: 'Social',
    badge: '9:16 • 60 FPS',
    config: {
      format: 'mp4',
      codec: 'h264',
      resolution: { w: 1080, h: 1920, label: 'Vertical 1080p' },
      fps: 60,
      quality: 'high',
      bitrateMode: 'auto',
      renderMode: 'auto'
    }
  },
  {
    id: 'reels_1080p60',
    name: 'Instagram Reels 1080p60',
    description: 'Crisp social frame rate with clean H.264 compression',
    category: 'Social',
    badge: '9:16 • 60 FPS',
    config: {
      format: 'mp4',
      codec: 'h264',
      resolution: { w: 1080, h: 1920, label: 'Vertical 1080p' },
      fps: 60,
      quality: 'high',
      bitrateMode: 'auto',
      renderMode: 'auto'
    }
  },
  {
    id: 'yt_1080p60',
    name: 'YouTube 1080p60',
    description: 'Standard creator broadcast HD at 60 frames per second',
    category: 'YouTube',
    badge: '16:9 • 60 FPS',
    config: {
      format: 'mp4',
      codec: 'h264',
      resolution: { w: 1920, h: 1080, label: 'Full HD' },
      fps: 60,
      quality: 'high',
      bitrateMode: 'auto',
      renderMode: 'auto'
    }
  },
  {
    id: 'yt_1440p60',
    name: 'YouTube 1440p60 (QHD)',
    description: 'Triggers VP9 high-bitrate encoding tier on YouTube',
    category: 'YouTube',
    badge: '1440p • 60 FPS',
    config: {
      format: 'mp4',
      codec: 'h264',
      resolution: { w: 2560, h: 1440, label: '1440p QHD' },
      fps: 60,
      quality: 'ultra',
      bitrateMode: 'auto',
      renderMode: 'high_perf'
    }
  },
  {
    id: 'yt_4k60',
    name: 'YouTube 4K60 (UHD)',
    description: 'Ultra High Definition professional cinema and tech export',
    category: 'YouTube',
    badge: '4K • 60 FPS',
    config: {
      format: 'mp4',
      codec: 'h264',
      resolution: { w: 3840, h: 2160, label: 'UHD 4K' },
      fps: 60,
      quality: 'ultra',
      bitrateMode: 'auto',
      renderMode: 'cloud_gpu'
    }
  },
  {
    id: 'yt_4k120',
    name: 'YouTube 4K120 Ultra-Motion',
    description: 'Maximum smoothness high-frame-rate master (Extreme Render)',
    category: 'Master',
    badge: '4K • 120 FPS',
    config: {
      format: 'mp4',
      codec: 'h264',
      resolution: { w: 3840, h: 2160, label: 'UHD 4K' },
      fps: 120,
      quality: 'master',
      bitrateMode: 'high',
      renderMode: 'cloud_gpu'
    }
  },
  {
    id: 'cinematic_4k24',
    name: 'Cinematic 4K24',
    description: 'Hollywood motion cadence at true 24.00 FPS with 180° motion blur',
    category: 'Cinema',
    badge: '4K • 24 FPS',
    config: {
      format: 'mp4',
      codec: 'h264',
      resolution: { w: 3840, h: 2160, label: 'UHD 4K' },
      fps: 24,
      quality: 'ultra',
      bitrateMode: 'auto',
      renderMode: 'auto',
      motionBlur: { enabled: true, shutterAngle: 180, samples: 16 }
    }
  },
  {
    id: 'gaming_1440p120',
    name: 'High FPS Gaming 1440p120',
    description: 'Buttery smooth 120 frames per second for high-motion gaming and esports',
    category: 'Master',
    badge: '1440p • 120 FPS',
    config: {
      format: 'mp4',
      codec: 'h264',
      resolution: { w: 2560, h: 1440, label: '1440p QHD' },
      fps: 120,
      quality: 'master',
      bitrateMode: 'high',
      renderMode: 'cloud_gpu'
    }
  },
  {
    id: 'vert_4k60',
    name: 'Vertical 4K60 Master',
    description: 'Ultra-crisp vertical mobile master for digital billboards and flagship reels',
    category: 'Social',
    badge: '9:16 • 4K • 60 FPS',
    config: {
      format: 'mp4',
      codec: 'h264',
      resolution: { w: 2160, h: 3840, label: 'Vertical 4K' },
      fps: 60,
      quality: 'ultra',
      bitrateMode: 'auto',
      renderMode: 'cloud_gpu'
    }
  },
  {
    id: 'vert_4k120',
    name: 'Vertical 4K120 Extreme',
    description: 'Highest fidelity vertical motion graphics with 120 FPS temporal sampling',
    category: 'Master',
    badge: '9:16 • 4K • 120 FPS',
    config: {
      format: 'mp4',
      codec: 'h264',
      resolution: { w: 2160, h: 3840, label: 'Vertical 4K' },
      fps: 120,
      quality: 'master',
      bitrateMode: 'high',
      renderMode: 'cloud_gpu'
    }
  }
];

// Calculate Target Bitrate in Mbps
export const getTargetBitrateMbps = (
  res: Resolution,
  fps: number,
  quality: ExportQuality
): number => {
  const pixels = res.w * res.h;
  const is1080p = pixels <= 1920 * 1080;
  const is1440p = pixels > 1920 * 1080 && pixels <= 2560 * 1440;
  const is4K = pixels > 2560 * 1440;

  let baseMbps = 15;
  if (is1080p) {
    baseMbps = fps > 60 ? 30 : fps >= 50 ? 20 : 12;
  } else if (is1440p) {
    baseMbps = fps > 60 ? 60 : fps >= 50 ? 40 : 25;
  } else if (is4K) {
    baseMbps = fps > 60 ? 140 : fps >= 50 ? 80 : 50;
  }

  const qualityMultipliers: Record<ExportQuality, number> = {
    draft: 0.6,
    standard: 1.0,
    high: 1.4,
    ultra: 1.9,
    master: 2.5
  };

  return Math.round(baseMbps * qualityMultipliers[quality]);
};

// Compute Units & Render Complexity Estimator
export interface RenderEstimate {
  totalFrames: number;
  estimatedSizeMB: number;
  complexity: 'Light' | 'Moderate' | 'Heavy' | 'Very Heavy' | 'Extreme';
  computeUnits: number;
  recommendedMode: RenderMode;
  isExtreme: boolean;
  warningMessage?: string;
}

export const calculateRenderEstimate = (
  project: ProjectState,
  config: ExportConfig
): RenderEstimate => {
  const duration = project.duration;
  const exportFps = config.fps;
  const totalFrames = Math.round(duration * exportFps);

  const bitrateMbps =
    config.bitrateMode === 'custom' && config.customBitrateMbps
      ? config.customBitrateMbps
      : getTargetBitrateMbps(config.resolution, config.fps, config.quality);

  const estimatedSizeMB = Math.max(0.5, Number(((bitrateMbps * duration) / 8).toFixed(1)));

  // Pixel ratio normalized to 1080p
  const pixelMultiplier = (config.resolution.w * config.resolution.h) / (1920 * 1080);
  const fpsFactor = exportFps / 30;
  const qualityFactor: Record<ExportQuality, number> = {
    draft: 0.7,
    standard: 1.0,
    high: 1.4,
    ultra: 2.2,
    master: 3.5
  };

  const layersCount = project.layers.length;
  const hasEffects = project.layers.some(
    (l) => (l.effects.blur && l.effects.blur > 0) || (l.effects.shadow && l.effects.shadow > 0)
  );
  const effectFactor = 1 + layersCount * 0.05 + (hasEffects ? 0.3 : 0);

  const rawUnits = pixelMultiplier * fpsFactor * duration * effectFactor * qualityFactor[config.quality];
  const computeUnits = Math.max(5, Math.round(rawUnits * 10));

  let complexity: RenderEstimate['complexity'] = 'Light';
  let isExtreme = false;
  let recommendedMode: RenderMode = 'local';

  if (computeUnits > 2500 || totalFrames >= 1200 || (pixelMultiplier >= 3.5 && exportFps >= 60)) {
    complexity = 'Extreme';
    isExtreme = true;
    recommendedMode = 'cloud_gpu';
  } else if (computeUnits > 1200 || totalFrames >= 600 || pixelMultiplier >= 3.5) {
    complexity = 'Very Heavy';
    recommendedMode = 'cloud_gpu';
  } else if (computeUnits > 450 || exportFps >= 60) {
    complexity = 'Heavy';
    recommendedMode = 'high_perf';
  } else if (computeUnits > 150) {
    complexity = 'Moderate';
    recommendedMode = 'local';
  } else {
    complexity = 'Light';
    recommendedMode = 'local';
  }

  let warningMessage: string | undefined;
  if (isExtreme) {
    warningMessage = `EXTREME RENDER WORKLOAD: ${config.resolution.w}×${config.resolution.h} @ ${exportFps} FPS requires rendering ${totalFrames} frames with deep rasterization. We recommend Cloud GPU rendering for zero frame drops and hardware-accelerated encoding.`;
  } else if (complexity === 'Very Heavy') {
    warningMessage = `HEAVY RENDER WORKLOAD: ${totalFrames} frames. Browser rendering may take 15-45 seconds. Keep this tab active.`;
  }

  return {
    totalFrames,
    estimatedSizeMB,
    complexity,
    computeUnits,
    recommendedMode,
    isExtreme,
    warningMessage
  };
};

// Preflight Validator (Section 41)
export interface PreflightReport {
  passed: boolean;
  checks: {
    name: string;
    status: 'pass' | 'warning' | 'fail';
    detail: string;
  }[];
}

export const runPreflightCheck = (
  project: ProjectState,
  config: ExportConfig,
  creditsAvailable: number
): PreflightReport => {
  const estimate = calculateRenderEstimate(project, config);
  const checks: PreflightReport['checks'] = [];

  // Check 1: Resolution bounds
  if (config.resolution.w <= 4096 && config.resolution.h <= 4096) {
    checks.push({
      name: 'Resolution Support',
      status: 'pass',
      detail: `${config.resolution.w}×${config.resolution.h} within validated maximum DCI 4K bounds`
    });
  } else {
    checks.push({
      name: 'Resolution Support',
      status: 'fail',
      detail: `Resolution exceeds maximum 4096px engine capability`
    });
  }

  // Check 2: FPS bounds
  if (config.fps <= 120) {
    checks.push({
      name: 'Temporal Sampling',
      status: 'pass',
      detail: `${config.fps} FPS deterministic keyframe sampling supported`
    });
  } else {
    checks.push({
      name: 'Temporal Sampling',
      status: 'fail',
      detail: `FPS exceeds 120 FPS platform limit`
    });
  }

  // Check 3: Layers integrity
  if (project.layers.length > 0) {
    checks.push({
      name: 'Composition Layers',
      status: 'pass',
      detail: `${project.layers.length} active layer(s) ready for rasterization`
    });
  } else {
    checks.push({
      name: 'Composition Layers',
      status: 'warning',
      detail: 'Composition is empty'
    });
  }

  // Check 4: Format & Codec Compatibility
  if (config.alpha && config.format !== 'webm' && config.format !== 'png_sequence') {
    checks.push({
      name: 'Alpha Transparency',
      status: 'fail',
      detail: 'Alpha channel transparency requires WebM container or PNG sequence'
    });
  } else {
    checks.push({
      name: 'Codec & Container',
      status: 'pass',
      detail: `${config.format.toUpperCase()} with ${config.codec.toUpperCase()} verified compatible`
    });
  }

  // Check 5: Render Credits
  if (creditsAvailable >= estimate.computeUnits) {
    checks.push({
      name: 'Render Allocation',
      status: 'pass',
      detail: `${estimate.computeUnits} Compute Units allocated (${creditsAvailable} available)`
    });
  } else {
    checks.push({
      name: 'Render Allocation',
      status: 'warning',
      detail: `Requires ${estimate.computeUnits} Compute Units (${creditsAvailable} remaining)`
    });
  }

  const passed = !checks.some((c) => c.status === 'fail');
  return { passed, checks };
};
