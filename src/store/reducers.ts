import {
  ProjectState,
  EditorState,
  AppState,
  EditorAction,
  Layer,
  BrandKitV2,
  StoryboardSceneV2
} from '../types';
import { generateId } from '../utils/animation';

export function editorReducer(
  present: { project: ProjectState; editor: EditorState },
  action: EditorAction
): { project: ProjectState; editor: EditorState } {
  const { project, editor } = present;

  switch (action.type) {
    case 'TOGGLE_PLAY':
      return { ...present, editor: { ...editor, isPlaying: !editor.isPlaying } };

    case 'SET_TIME':
      return { ...present, editor: { ...editor, currentTime: action.payload } };

    case 'SET_ZOOM':
      return { ...present, editor: { ...editor, zoom: action.payload } };

    case 'SELECT_LAYER':
      return { ...present, editor: { ...editor, selectedLayerIds: [action.payload] } };

    case 'SET_WORKSPACE_MODE':
      return { ...present, editor: { ...editor, workspaceMode: action.payload } };

    case 'SET_CREATE_SUB_TAB':
      return { ...present, editor: { ...editor, createSubTab: action.payload } };

    case 'SET_ACTIVE_TAB':
      return { ...present, editor: { ...editor, activeTab: action.payload } };

    case 'TOGGLE_EXPORT':
      return {
        ...present,
        editor: { ...editor, showExportDialog: action.payload, exportProgress: 0 }
      };

    case 'SET_EXPORT_PROGRESS':
      return { ...present, editor: { ...editor, exportProgress: action.payload } };

    case 'TOGGLE_AUTO_KEYFRAME':
      return { ...present, editor: { ...editor, autoKeyframe: !editor.autoKeyframe } };

    case 'SET_PREVIEW_QUALITY':
      return { ...present, editor: { ...editor, previewQuality: action.payload } };

    case 'DEDUCT_CREDITS':
      return {
        ...present,
        editor: { ...editor, renderCredits: Math.max(0, editor.renderCredits - action.payload) }
      };

    case 'UPDATE_BEAT_SYNC':
      return {
        ...present,
        editor: { ...editor, beatSync: { ...editor.beatSync, ...action.payload } }
      };

    case 'TOGGLE_BEAT_SYNC':
      return {
        ...present,
        editor: {
          ...editor,
          beatSync: {
            ...editor.beatSync,
            enabled: action.payload?.enabled !== undefined ? action.payload.enabled : !editor.beatSync.enabled,
            bpm: action.payload?.bpm || editor.beatSync.bpm
          }
        }
      };

    case 'SET_RENDER_WORKERS':
      return {
        ...present,
        editor: { ...editor, currentWorkers: action.payload }
      };

    case 'SET_BRAND_KIT': {
      const mergedBrand: BrandKitV2 = {
        ...(project.brandKit || editor.brandKit || {
          primaryColor: '#3b82f6',
          secondaryColor: '#8b5cf6',
          accentColor: '#f59e0b',
          headlineFont: 'system-ui, sans-serif',
          bodyFont: 'system-ui, sans-serif',
          brandTone: 'Confident',
          ctaStyle: 'Order Now',
          motionDNA: {
            style: 'Smooth',
            easing: 'easeOutBack',
            transitions: 'Slide',
            rotation: 'Low',
            bounce: true,
            textAnimation: 'Kinetic Slide'
          },
          restrictedWords: [],
          pronunciationDictionary: {},
          colors: ['#ffffff', '#3b82f6', '#8b5cf6'],
          defaultFont: 'system-ui, sans-serif'
        }),
        ...action.payload
      };
      return {
        ...present,
        project: { ...project, brandKit: mergedBrand },
        editor: { ...editor, brandKit: mergedBrand }
      };
    }

    case 'UPDATE_CREATIVE_BRIEF': {
      const updatedBrief = {
        ...(project.creativeBrief || {
          id: `brief_${generateId()}`,
          projectObjective: '',
          product: '',
          audience: '',
          platform: 'Omni-channel' as const,
          duration: 15,
          aspectRatio: '16:9' as const,
          visualStyle: '',
          brandPersonality: '',
          keyMessage: '',
          cta: '',
          voiceStyle: '',
          musicStyle: '',
          requiredAssets: '',
          restrictions: ''
        }),
        ...action.payload
      };
      return {
        ...present,
        project: { ...project, creativeBrief: updatedBrief }
      };
    }

    case 'SET_STORYBOARD_SCENES':
      return {
        ...present,
        project: { ...project, storyboardScenes: action.payload }
      };

    case 'UPDATE_STORYBOARD_SCENE': {
      const scenes = (project.storyboardScenes || []).map((sc) =>
        sc.id === action.payload.id ? { ...sc, ...action.payload.updates } : sc
      );
      return {
        ...present,
        project: { ...project, storyboardScenes: scenes }
      };
    }

    case 'ADD_GENERATED_ASSET':
      return {
        ...present,
        project: {
          ...project,
          generatedAssets: [action.payload, ...(project.generatedAssets || [])]
        }
      };

    case 'ADD_GENERATION_JOB':
      return {
        ...present,
        editor: {
          ...editor,
          generationJobs: [action.payload, ...(editor.generationJobs || [])]
        }
      };

    case 'UPDATE_GENERATION_JOB': {
      const jobs = editor.generationJobs.map((j) =>
        j.id === action.payload.id ? { ...j, ...action.payload.updates } : j
      );
      return {
        ...present,
        editor: { ...editor, generationJobs: jobs }
      };
    }

    case 'UPDATE_BATCH_ROW': {
      const updatedRows = editor.batchDataset.map((row) =>
        row.id === action.payload.id ? { ...row, ...action.payload.updates } : row
      );
      return {
        ...present,
        editor: { ...editor, batchDataset: updatedRows }
      };
    }

    case 'SET_BATCH_DATASET':
      return {
        ...present,
        editor: { ...editor, batchDataset: action.payload }
      };

    case 'UPDATE_VARIANT': {
      const updatedVariants = editor.variants.map((v) =>
        v.id === action.payload.id ? { ...v, ...action.payload.updates } : v
      );
      return {
        ...present,
        editor: { ...editor, variants: updatedVariants }
      };
    }

    case 'AUTO_BUILD_TIMELINE': {
      const { scenes, level } = action.payload;
      if (!scenes || scenes.length === 0) return present;

      const totalDuration = scenes[scenes.length - 1].endSec || 15;
      const newLayers: Layer[] = [];

      // 1. Dark Base Background
      newLayers.push({
        id: `bg_master_${generateId()}`,
        name: 'Master Stage Background',
        type: 'rect',
        baseProps: {
          x: project.resolution.w / 2,
          y: project.resolution.h / 2,
          width: project.resolution.w,
          height: project.resolution.h,
          fill: '#08080c',
          opacity: 1,
          rotation: 0,
          scale: 1
        },
        effects: { blur: 0, shadow: 0 },
        animations: {}
      });

      // 2. Build layers for each storyboard scene
      scenes.forEach((sc, idx) => {
        const sceneMid = (sc.startSec + sc.endSec) / 2;
        const colorPalette = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];
        const accentColor = colorPalette[idx % colorPalette.length];

        // Visual Media Layer / Scene Card
        newLayers.push({
          id: `sc_media_${idx}_${generateId()}`,
          name: `[Scene ${sc.sceneNumber}] ${sc.phase} Visual`,
          type: 'circle',
          baseProps: {
            x: project.resolution.w / 2,
            y: project.resolution.h / 2,
            width: Math.round(project.resolution.w * 0.35),
            height: Math.round(project.resolution.w * 0.35),
            fill: 'transparent',
            stroke: accentColor,
            strokeWidth: 4,
            borderRadius: '50%',
            opacity: 0,
            rotation: 0,
            scale: 0.8
          },
          effects: { blur: 0, shadow: 15, glow: 25 },
          animations: {
            opacity: [
              { time: Math.max(0, sc.startSec - 0.1), value: 0, easing: 'linear' },
              { time: sc.startSec + 0.3, value: 1 },
              { time: sc.endSec - 0.2, value: 1 },
              { time: sc.endSec, value: 0 }
            ],
            scale: [
              { time: sc.startSec, value: 0.7, easing: 'easeOutBack' },
              { time: sceneMid, value: 1 },
              { time: sc.endSec, value: 1.15 }
            ],
            rotation: [
              { time: sc.startSec, value: 0, easing: 'linear' },
              { time: sc.endSec, value: 90 }
            ]
          }
        });

        // On-Screen Typography Layer
        newLayers.push({
          id: `sc_txt_${idx}_${generateId()}`,
          name: `[Scene ${sc.sceneNumber}] Typography`,
          type: 'text',
          text: sc.onScreenText || sc.title.toUpperCase(),
          baseProps: {
            x: project.resolution.w / 2,
            y: project.resolution.h * 0.48,
            width: Math.round(project.resolution.w * 0.7),
            height: 120,
            fill: '#ffffff',
            fontSize: Math.round(project.resolution.h * 0.07),
            fontWeight: '900',
            letterSpacing: '2px',
            opacity: 0,
            rotation: 0,
            scale: 1
          },
          effects: { blur: 0, shadow: 20, glow: 15 },
          animations: {
            opacity: [
              { time: Math.max(0, sc.startSec), value: 0, easing: 'linear' },
              { time: sc.startSec + 0.4, value: 1 },
              { time: sc.endSec - 0.3, value: 1 },
              { time: sc.endSec, value: 0 }
            ],
            y: [
              { time: sc.startSec, value: project.resolution.h * 0.53, easing: 'easeOutBack' },
              { time: sc.startSec + 0.5, value: project.resolution.h * 0.48 }
            ]
          }
        });

        // Voiceover Subtitle Caption Layer
        if (sc.voiceover) {
          newLayers.push({
            id: `sc_vo_${idx}_${generateId()}`,
            name: `[Scene ${sc.sceneNumber}] Caption`,
            type: 'text',
            text: `"${sc.voiceover}"`,
            baseProps: {
              x: project.resolution.w / 2,
              y: project.resolution.h * 0.57,
              width: Math.round(project.resolution.w * 0.6),
              height: 45,
              fill: accentColor,
              fontSize: Math.round(project.resolution.h * 0.025),
              fontWeight: '600',
              letterSpacing: '1.5px',
              opacity: 0,
              rotation: 0,
              scale: 1
            },
            effects: { blur: 0, shadow: 10 },
            animations: {
              opacity: [
                { time: sc.startSec + 0.2, value: 0, easing: 'linear' },
                { time: sc.startSec + 0.6, value: 1 },
                { time: sc.endSec - 0.2, value: 1 },
                { time: sc.endSec, value: 0 }
              ]
            }
          });
        }
      });

      return {
        ...present,
        project: {
          ...project,
          duration: totalDuration,
          layers: newLayers,
          storyboardScenes: scenes
        },
        editor: {
          ...editor,
          currentTime: 0,
          selectedLayerIds: [newLayers[newLayers.length - 1].id]
        }
      };
    }

    case 'ADD_EXPORT_HISTORY':
      return {
        ...present,
        editor: {
          ...editor,
          exportHistory: [action.payload, ...(editor.exportHistory || [])]
        }
      };

    // Project Mutations
    case 'UPDATE_PROJECT_NAME':
      return { ...present, project: { ...project, name: action.payload } };

    case 'UPDATE_PROJECT_SETTINGS':
      return { ...present, project: { ...project, ...action.payload } };

    case 'ADD_LAYER':
      return {
        ...present,
        project: { ...project, layers: [...project.layers, action.payload] },
        editor: { ...editor, selectedLayerIds: [action.payload.id] }
      };

    case 'DELETE_LAYER': {
      const targetId = action.payload || editor.selectedLayerIds[0];
      const newLayers = project.layers.filter((l) => l.id !== targetId);
      const remainingSelected = editor.selectedLayerIds.filter((id) => id !== targetId);
      return {
        ...present,
        project: { ...project, layers: newLayers },
        editor: {
          ...editor,
          selectedLayerIds:
            remainingSelected.length > 0
              ? remainingSelected
              : newLayers[0]
              ? [newLayers[0].id]
              : []
        }
      };
    }

    case 'DUPLICATE_LAYER': {
      const targetId = action.payload || editor.selectedLayerIds[0];
      const sourceLayer = project.layers.find((l) => l.id === targetId);
      if (!sourceLayer) return present;

      const duplicated: Layer = {
        ...sourceLayer,
        id: `${sourceLayer.type}_${generateId()}`,
        name: `${sourceLayer.name} Copy`,
        baseProps: {
          ...sourceLayer.baseProps,
          x: sourceLayer.baseProps.x + 30,
          y: sourceLayer.baseProps.y + 30
        },
        animations: JSON.parse(JSON.stringify(sourceLayer.animations))
      };

      return {
        ...present,
        project: { ...project, layers: [...project.layers, duplicated] },
        editor: { ...editor, selectedLayerIds: [duplicated.id] }
      };
    }

    case 'REORDER_LAYERS': {
      const { sourceIndex, targetIndex } = action.payload;
      const newLayers = [...project.layers];
      const [moved] = newLayers.splice(sourceIndex, 1);
      newLayers.splice(targetIndex, 0, moved);
      return { ...present, project: { ...project, layers: newLayers } };
    }

    case 'TOGGLE_LAYER_VISIBILITY': {
      const updatedLayers = project.layers.map((layer) =>
        layer.id === action.payload
          ? { ...layer, visible: layer.visible !== false ? false : true }
          : layer
      );
      return { ...present, project: { ...project, layers: updatedLayers } };
    }

    case 'COMMIT_PROPERTY': {
      const { id, prop, value, time, isAutoKeyframe, isEffect } = action.payload;
      const updatedLayers = project.layers.map((layer) => {
        if (layer.id !== id) return layer;

        const updated = { ...layer };

        if (isEffect) {
          updated.effects = { ...updated.effects, [prop]: value };
          return updated;
        }

        updated.baseProps = { ...updated.baseProps, [prop]: value };

        // Handle auto-keyframing if enabled
        if (isAutoKeyframe && editor.autoKeyframe) {
          const currentTrack = updated.animations[prop] ? [...updated.animations[prop]] : [];
          const existingKfIndex = currentTrack.findIndex(
            (kf) => Math.abs(kf.time - time) < 0.05
          );

          if (existingKfIndex >= 0) {
            currentTrack[existingKfIndex] = {
              ...currentTrack[existingKfIndex],
              value: Number(value),
              time
            };
          } else {
            currentTrack.push({ time, value: Number(value), easing: 'easeInOutQuad' });
            currentTrack.sort((a, b) => a.time - b.time);
          }
          updated.animations = { ...updated.animations, [prop]: currentTrack };
        }

        return updated;
      });

      return { ...present, project: { ...project, layers: updatedLayers } };
    }

    case 'APPLY_AI_MOTION': {
      const { id, animations } = action.payload;
      const updatedLayers = project.layers.map((layer) =>
        layer.id === id ? { ...layer, animations: { ...layer.animations, ...animations } } : layer
      );
      return { ...present, project: { ...project, layers: updatedLayers } };
    }

    case 'CLEAR_ANIMATIONS': {
      const { id, prop } = action.payload;
      const updatedLayers = project.layers.map((layer) => {
        if (layer.id !== id) return layer;
        if (prop) {
          const nextAnim = { ...layer.animations };
          delete nextAnim[prop];
          return { ...layer, animations: nextAnim };
        }
        return { ...layer, animations: {} };
      });
      return { ...present, project: { ...project, layers: updatedLayers } };
    }

    case 'LOAD_PROJECT':
      return {
        ...present,
        project: action.payload,
        editor: {
          ...editor,
          currentTime: 0,
          selectedLayerIds: action.payload.layers[0] ? [action.payload.layers[0].id] : []
        }
      };

    case 'APPLY_STORYBOARD':
      return {
        ...present,
        project: action.payload,
        editor: {
          ...editor,
          currentTime: 0,
          selectedLayerIds: action.payload.layers[0] ? [action.payload.layers[0].id] : []
        }
      };

    case 'RESPONSIVE_RESIZE': {
      const { targetResolution, scaleFactors } = action.payload;
      const updatedLayers = project.layers.map((layer) => {
        const newLayer = {
          ...layer,
          baseProps: {
            ...layer.baseProps,
            x: Math.round(layer.baseProps.x * scaleFactors.scaleX),
            y: Math.round(layer.baseProps.y * scaleFactors.scaleY)
          }
        };

        if (newLayer.baseProps.width) {
          newLayer.baseProps.width = Math.round(newLayer.baseProps.width * scaleFactors.scaleX);
        }
        if (newLayer.baseProps.height) {
          newLayer.baseProps.height = Math.round(newLayer.baseProps.height * scaleFactors.scaleY);
        }
        if (newLayer.baseProps.fontSize) {
          newLayer.baseProps.fontSize = Math.round(
            newLayer.baseProps.fontSize * Math.min(scaleFactors.scaleX, scaleFactors.scaleY)
          );
        }

        // Rescale position animation keyframes
        if (newLayer.animations) {
          const newAnims = { ...newLayer.animations };
          if (newAnims.x) {
            newAnims.x = newAnims.x.map((kf) => ({
              ...kf,
              value: Math.round(kf.value * scaleFactors.scaleX)
            }));
          }
          if (newAnims.y) {
            newAnims.y = newAnims.y.map((kf) => ({
              ...kf,
              value: Math.round(kf.value * scaleFactors.scaleY)
            }));
          }
          newLayer.animations = newAnims;
        }
        return newLayer;
      });

      return {
        ...present,
        project: {
          ...project,
          resolution: targetResolution,
          layers: updatedLayers
        }
      };
    }

    default:
      return present;
  }
}

export function historyReducer(state: AppState, action: EditorAction): AppState {
  const { past, present, future } = state;

  if (action.type === 'UNDO') {
    if (past.length === 0) return state;
    const previous = past[past.length - 1];
    return {
      past: past.slice(0, past.length - 1),
      present: { project: previous, editor: present.editor },
      future: [present.project, ...future]
    };
  }

  if (action.type === 'REDO') {
    if (future.length === 0) return state;
    const next = future[0];
    return {
      past: [...past, present.project],
      present: { project: next, editor: present.editor },
      future: future.slice(1)
    };
  }

  const isMutation = [
    'ADD_LAYER',
    'DELETE_LAYER',
    'DUPLICATE_LAYER',
    'REORDER_LAYERS',
    'UPDATE_PROJECT_NAME',
    'UPDATE_PROJECT_SETTINGS',
    'TOGGLE_LAYER_VISIBILITY',
    'COMMIT_PROPERTY',
    'APPLY_AI_MOTION',
    'CLEAR_ANIMATIONS',
    'LOAD_PROJECT',
    'APPLY_STORYBOARD',
    'RESPONSIVE_RESIZE',
    'AUTO_BUILD_TIMELINE',
    'UPDATE_CREATIVE_BRIEF',
    'SET_STORYBOARD_SCENES',
    'UPDATE_STORYBOARD_SCENE',
    'ADD_GENERATED_ASSET',
    'SET_BRAND_KIT'
  ].includes(action.type);

  const newPresent = editorReducer(present, action);

  if (isMutation && present.project !== newPresent.project) {
    return {
      past: [...past.slice(-25), present.project],
      present: newPresent,
      future: []
    };
  }

  return { ...state, present: newPresent };
}
