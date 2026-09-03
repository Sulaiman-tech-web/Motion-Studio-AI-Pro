import React, { useRef, useEffect, useState } from 'react';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, Compass, Smartphone, Tv } from 'lucide-react';
import { ProjectState, EditorState, EditorAction, Layer } from '../types';
import { getInterpolatedValue } from '../utils/animation';

interface CanvasAreaProps {
  project: ProjectState;
  editor: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  isMobile: boolean;
  dragState: any;
  setDragState: React.Dispatch<React.SetStateAction<any>>;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  project,
  editor,
  dispatch,
  isMobile,
  dragState,
  setDragState
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showGuides, setShowGuides] = useState(true);
  const [showSocialOverlay, setShowSocialOverlay] = useState(false);

  const isVertical = project.resolution.h > project.resolution.w;

  // Auto fit zoom on mount or project resolution change
  useEffect(() => {
    if (containerRef.current) {
      const padding = isMobile ? 24 : 64;
      const containerWidth = containerRef.current.clientWidth - padding;
      const containerHeight = containerRef.current.clientHeight - padding;

      if (containerWidth > 0 && containerHeight > 0) {
        const fitScale = Math.min(
          containerWidth / project.resolution.w,
          containerHeight / project.resolution.h
        );
        if (isMobile) {
          dispatch({ type: 'SET_ZOOM', payload: Math.max(0.08, Number(fitScale.toFixed(2))) });
        }
      }
    }
  }, [isMobile, project.resolution.w, project.resolution.h, dispatch]);

  const fitToView = () => {
    if (!containerRef.current) return;
    const padding = isMobile ? 24 : 64;
    const containerWidth = containerRef.current.clientWidth - padding;
    const containerHeight = containerRef.current.clientHeight - padding;
    if (containerWidth > 0 && containerHeight > 0) {
      const fitScale = Math.min(
        containerWidth / project.resolution.w,
        containerHeight / project.resolution.h
      );
      dispatch({ type: 'SET_ZOOM', payload: Math.max(0.08, Number(fitScale.toFixed(2))) });
    }
  };

  const scale = editor.zoom;
  const canvasWidth = project.resolution.w * scale;
  const canvasHeight = project.resolution.h * scale;

  // Calculate beat pulse modulation factor
  let beatPulse = 1.0;
  if (editor.beatSync.enabled) {
    const bps = editor.beatSync.bpm / 60;
    const beatPhase = (editor.currentTime * bps) % 1;
    beatPulse = 1.0 + Math.pow(Math.max(0, 1 - beatPhase * 3), 2) * 0.08;
  }

  const handleLayerPointerDown = (e: React.PointerEvent, layer: Layer) => {
    if (e.button !== 0) return;
    e.stopPropagation();

    if (layer.locked) return;

    dispatch({ type: 'SELECT_LAYER', payload: layer.id });

    const currentX = getInterpolatedValue(layer.animations.x, editor.currentTime, layer.baseProps.x);
    const currentY = getInterpolatedValue(layer.animations.y, editor.currentTime, layer.baseProps.y);

    setDragState({
      type: 'layer',
      id: layer.id,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      initX: currentX,
      initY: currentY,
      currentX,
      currentY
    });
  };

  return (
    <div
      ref={containerRef}
      id="canvas-viewport"
      className="flex-1 bg-neutral-925 relative overflow-hidden flex items-center justify-center select-none bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px]"
    >
      {/* Canvas Viewport Board */}
      <div
        id="canvas-board"
        className="bg-black relative shadow-2xl overflow-hidden shadow-black/80 ring-1 ring-white/10 transition-shadow"
        style={{
          width: canvasWidth,
          height: canvasHeight,
          transition: dragState ? 'none' : 'width 0.1s ease-out, height 0.1s ease-out'
        }}
      >
        {/* Background Click Plane */}
        <div id="canvas-background-plane" className="absolute inset-0 z-0" />

        {/* Safe Area Guides (Section 83 & 84) */}
        {showGuides && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
            {/* Action Safe (90%) */}
            <div
              className="border border-neutral-700/40 border-dashed absolute"
              style={{ width: canvasWidth * 0.9, height: canvasHeight * 0.9 }}
            />
            {/* Title Safe (80%) */}
            <div
              className="border border-neutral-700/25 border-dashed absolute"
              style={{ width: canvasWidth * 0.8, height: canvasHeight * 0.8 }}
            />
            {/* Center Crosshairs */}
            <div className="absolute w-6 h-px bg-neutral-600/50" />
            <div className="absolute w-px h-6 bg-neutral-600/50" />
          </div>
        )}

        {/* Social Mobile UI Overlay (for 9:16 Vertical format: TikTok/Reels UI simulation) */}
        {showSocialOverlay && isVertical && (
          <div className="absolute inset-0 pointer-events-none z-35 flex flex-col justify-between p-4 border border-rose-500/20">
            <div className="flex justify-between text-[10px] text-rose-400/80 font-mono bg-black/40 px-2 py-1 rounded">
              <span>Top Search / Tabs Safe Zone</span>
              <span>120px</span>
            </div>
            <div className="flex justify-end pr-2 pb-16">
              <div className="w-10 h-36 border border-rose-500/30 rounded flex flex-col items-center justify-around text-[8px] text-rose-400 font-mono bg-black/30">
                <span>Like</span>
                <span>Comment</span>
                <span>Share</span>
              </div>
            </div>
            <div className="text-[10px] text-rose-400/80 font-mono bg-black/40 px-2 py-1 rounded">
              <span>Bottom Caption & Audio Safe Zone (200px)</span>
            </div>
          </div>
        )}

        {/* Layers Rendering */}
        {project.layers.map((layer, index) => {
          if (layer.visible === false) return null;

          const isSelected = editor.selectedLayerIds.includes(layer.id);
          const isDragging = dragState && dragState.id === layer.id;

          const x =
            isDragging && dragState.currentX !== undefined
              ? dragState.currentX
              : getInterpolatedValue(layer.animations.x, editor.currentTime, layer.baseProps.x);
          const y =
            isDragging && dragState.currentY !== undefined
              ? dragState.currentY
              : getInterpolatedValue(layer.animations.y, editor.currentTime, layer.baseProps.y);

          const opacity = getInterpolatedValue(
            layer.animations.opacity,
            editor.currentTime,
            layer.baseProps.opacity ?? 1
          );

          let scaleVal = getInterpolatedValue(
            layer.animations.scale,
            editor.currentTime,
            layer.baseProps.scale ?? 1
          );

          // Apply beat pulse modulation if beat sync is active
          if (editor.beatSync.enabled && (isSelected || layer.effects.glow)) {
            scaleVal *= beatPulse;
          }

          const rotation = getInterpolatedValue(
            layer.animations.rotation,
            editor.currentTime,
            layer.baseProps.rotation ?? 0
          );

          const blur = layer.effects?.blur || 0;
          const shadow = layer.effects?.shadow || 0;
          const glow = layer.effects?.glow || 0;

          const layerStyle: React.CSSProperties = {
            position: 'absolute',
            left: `${x * scale}px`,
            top: `${y * scale}px`,
            opacity: Math.max(0, Math.min(1, opacity)),
            transform: `translate(-50%, -50%) scale(${scaleVal}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
            cursor: layer.locked ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
            zIndex: index + 1,
            filter: `blur(${blur * scale}px) drop-shadow(0px ${(shadow * 0.5 * scale).toFixed(1)}px ${(shadow * scale).toFixed(1)}px rgba(0,0,0,0.6))`
          };

          let content = null;

          if (layer.type === 'text') {
            content = (
              <div
                style={{
                  color: layer.baseProps.fill || '#ffffff',
                  fontSize: `${(layer.baseProps.fontSize || 80) * scale}px`,
                  fontWeight: layer.baseProps.fontWeight || 'bold',
                  letterSpacing: layer.baseProps.letterSpacing || 'normal',
                  whiteSpace: 'nowrap',
                  padding: '4px',
                  textShadow:
                    glow > 0
                      ? `0 0 ${glow * scale}px ${layer.baseProps.fill || '#3b82f6'}`
                      : shadow > 0
                      ? `0 ${shadow * 0.5 * scale}px ${shadow * scale}px rgba(0,0,0,0.7)`
                      : 'none',
                  WebkitTextStroke: layer.baseProps.stroke
                    ? `${(layer.baseProps.strokeWidth || 1) * scale}px ${layer.baseProps.stroke}`
                    : 'none'
                }}
              >
                {layer.text}
              </div>
            );
          } else if (layer.type === 'circle' || layer.baseProps.borderRadius === '50%') {
            content = (
              <div
                style={{
                  width: `${(layer.baseProps.width || 400) * scale}px`,
                  height: `${(layer.baseProps.height || 400) * scale}px`,
                  backgroundColor: layer.baseProps.fill || 'transparent',
                  border: layer.baseProps.stroke
                    ? `${(layer.baseProps.strokeWidth || 2) * scale}px solid ${layer.baseProps.stroke}`
                    : 'none',
                  borderRadius: '50%',
                  boxShadow:
                    glow > 0
                      ? `0 0 ${glow * scale}px ${layer.baseProps.stroke || '#3b82f6'}`
                      : 'none'
                }}
              />
            );
          } else {
            // Rect / Box
            content = (
              <div
                style={{
                  width: `${(layer.baseProps.width || 400) * scale}px`,
                  height: `${(layer.baseProps.height || 400) * scale}px`,
                  backgroundColor: layer.baseProps.fill || '#3b82f6',
                  border: layer.baseProps.stroke
                    ? `${(layer.baseProps.strokeWidth || 1) * scale}px solid ${layer.baseProps.stroke}`
                    : 'none',
                  borderRadius: layer.baseProps.borderRadius || '0px',
                  boxShadow:
                    glow > 0
                      ? `0 0 ${glow * scale}px ${layer.baseProps.fill || '#3b82f6'}`
                      : 'none'
                }}
              />
            );
          }

          return (
            <div
              key={layer.id}
              id={`layer-element-${layer.id}`}
              onPointerDown={(e) => handleLayerPointerDown(e, layer)}
              style={layerStyle}
            >
              {content}

              {/* Active Selection Box with resize anchors */}
              {isSelected && !layer.locked && (
                <div
                  className="absolute inset-0 border-2 border-blue-500 pointer-events-none -m-1"
                  style={{ borderRadius: layer.baseProps.borderRadius || '2px' }}
                >
                  <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-500 rounded-sm shadow-sm" />
                  <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-500 rounded-sm shadow-sm" />
                  <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-500 rounded-sm shadow-sm" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-500 rounded-sm shadow-sm" />

                  {/* Drag Tooltip */}
                  {isDragging && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
                      X: {Math.round(x)} Y: {Math.round(y)}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Canvas Controls (Bottom Right) */}
      <div className="absolute bottom-4 right-4 bg-neutral-950/90 backdrop-blur border border-neutral-800 rounded-lg flex items-center px-1.5 py-1 text-xs text-neutral-400 z-20 shadow-xl gap-1">
        {/* Guides toggle */}
        <button
          onClick={() => setShowGuides(!showGuides)}
          className={`p-1.5 rounded hover:text-white transition ${
            showGuides ? 'text-blue-400 bg-blue-500/10' : 'text-neutral-500'
          }`}
          title={showGuides ? 'Hide Safe Area Guides' : 'Show Safe Area Guides'}
        >
          <Compass size={14} />
        </button>

        {/* Social Mobile UI Overlay toggle (for vertical compositions) */}
        {isVertical && (
          <button
            onClick={() => setShowSocialOverlay(!showSocialOverlay)}
            className={`p-1.5 rounded hover:text-white transition ${
              showSocialOverlay ? 'text-rose-400 bg-rose-500/10' : 'text-neutral-500'
            }`}
            title="Toggle TikTok / Reels UI Safe Overlay"
          >
            <Smartphone size={14} />
          </button>
        )}

        <div className="w-px h-3.5 bg-neutral-800" />

        <button
          onClick={() =>
            dispatch({
              type: 'SET_ZOOM',
              payload: Math.max(0.08, Number((editor.zoom - 0.1).toFixed(2)))
            })
          }
          className="p-1.5 hover:text-white transition"
          title="Zoom Out"
        >
          <ZoomOut size={14} />
        </button>

        <button
          onClick={fitToView}
          className="px-2 py-0.5 font-mono text-[11px] hover:text-white transition"
          title="Fit Canvas to View"
        >
          {Math.round(editor.zoom * 100)}%
        </button>

        <button
          onClick={() =>
            dispatch({
              type: 'SET_ZOOM',
              payload: Math.min(2.5, Number((editor.zoom + 0.1).toFixed(2)))
            })
          }
          className="p-1.5 hover:text-white transition"
          title="Zoom In"
        >
          <ZoomIn size={14} />
        </button>

        <button
          onClick={fitToView}
          className="p-1.5 hover:text-white transition text-neutral-400"
          title="Reset Zoom to Fit"
        >
          <Maximize2 size={13} />
        </button>
      </div>
    </div>
  );
};
