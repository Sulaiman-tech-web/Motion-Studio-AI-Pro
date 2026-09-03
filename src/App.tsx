import React, { useState, useEffect, useRef, useReducer, useCallback } from 'react';
import { initialState, historyReducer } from './store';
import { TopBar, DesktopWorkspace, MobileWorkspace, ExportModal } from './components';

export default function App() {
  const [state, dispatch] = useReducer(historyReducer, initialState);
  const { project, editor } = state.present;
  const requestRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number | undefined>(undefined);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  // Temporary UI State for Dragging
  const [dragState, setDragState] = useState<any>(null);

  // Autosave to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('motion_studio_v4_autosave', JSON.stringify(project));
      } catch {
        // ignore
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [project]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  // Keyboard Shortcuts (Space to play/pause, Ctrl+Z undo, Ctrl+Y redo, Ctrl+E export)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_PLAY' });
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          dispatch({ type: 'REDO' });
        } else {
          dispatch({ type: 'UNDO' });
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_EXPORT', payload: true });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Subframe playback animation loop
  const animate = useCallback(
    (time: number) => {
      if (editor.isPlaying) {
        if (lastTimeRef.current !== undefined) {
          const deltaTime = (time - lastTimeRef.current) / 1000;
          let newTime = editor.currentTime + deltaTime;
          if (newTime >= project.duration) {
            newTime = 0;
          }
          dispatch({ type: 'SET_TIME', payload: Number(newTime.toFixed(3)) });
        }
        lastTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
      } else {
        lastTimeRef.current = undefined;
      }
    },
    [editor.isPlaying, editor.currentTime, project.duration]
  );

  useEffect(() => {
    if (editor.isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [editor.isPlaying, animate]);

  // Global drag handler for canvas layer position and playhead scrub
  useEffect(() => {
    if (!dragState) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (dragState.type === 'layer') {
        const dx = (e.clientX - dragState.startMouseX) / editor.zoom;
        const dy = (e.clientY - dragState.startMouseY) / editor.zoom;
        setDragState((prev: any) => ({
          ...prev,
          currentX: prev.initX + dx,
          currentY: prev.initY + dy
        }));
      } else if (dragState.type === 'playhead') {
        const rect = dragState.container.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        dispatch({
          type: 'SET_TIME',
          payload: Number((percentage * project.duration).toFixed(3))
        });
      }
    };

    const handleMouseUp = () => {
      if (dragState.type === 'layer' && dragState.currentX !== undefined) {
        dispatch({
          type: 'COMMIT_PROPERTY',
          payload: {
            id: dragState.id,
            prop: 'x',
            value: Math.round(dragState.currentX),
            time: editor.currentTime,
            isAutoKeyframe: editor.autoKeyframe
          }
        });
        dispatch({
          type: 'COMMIT_PROPERTY',
          payload: {
            id: dragState.id,
            prop: 'y',
            value: Math.round(dragState.currentY),
            time: editor.currentTime,
            isAutoKeyframe: editor.autoKeyframe
          }
        });
      }
      setDragState(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, editor.zoom, editor.currentTime, editor.autoKeyframe, project.duration]);

  return (
    <div id="motion-studio-root" className="h-screen w-screen flex flex-col bg-neutral-950 text-white font-sans overflow-hidden select-none">
      <TopBar
        project={project}
        editor={editor}
        isMobile={isMobile}
        canUndo={state.past.length > 0}
        canRedo={state.future.length > 0}
        dispatch={dispatch}
      />

      {isMobile ? (
        <MobileWorkspace
          project={project}
          editor={editor}
          dispatch={dispatch}
          isMobile={isMobile}
          dragState={dragState}
          setDragState={setDragState}
        />
      ) : (
        <DesktopWorkspace
          project={project}
          editor={editor}
          dispatch={dispatch}
          isMobile={isMobile}
          dragState={dragState}
          setDragState={setDragState}
        />
      )}

      <ExportModal project={project} editor={editor} dispatch={dispatch} />
    </div>
  );
}
