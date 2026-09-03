import React from 'react';
import {
  Wand2,
  Film,
  LayoutGrid,
  Sliders,
  Layers,
  Play,
  Pause,
  ArrowRight
} from 'lucide-react';
import { ProjectState, EditorState, EditorAction } from '../types';
import { CanvasArea } from './CanvasArea';
import { PropertiesPanel } from './PropertiesPanel';
import { AIPanel } from './AIPanel';
import { AIStoryboardPanel } from './AIStoryboardPanel';
import { TemplatesAndBrandPanel } from './TemplatesAndBrandPanel';
import { LayersPanel } from './LayersPanel';
import { CreateWorkspace } from './creative/CreateWorkspace';

interface MobileWorkspaceProps {
  project: ProjectState;
  editor: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  isMobile: boolean;
  dragState: any;
  setDragState: React.Dispatch<React.SetStateAction<any>>;
}

export const MobileWorkspace: React.FC<MobileWorkspaceProps> = ({
  project,
  editor,
  dispatch,
  isMobile,
  dragState,
  setDragState
}) => {
  if (editor.workspaceMode === 'CREATE') {
    return (
      <div id="mobile-workspace-create" className="flex-1 flex flex-col overflow-hidden relative bg-neutral-950">
        <CreateWorkspace project={project} editor={editor} dispatch={dispatch} />
        <button
          onClick={() => dispatch({ type: 'SET_WORKSPACE_MODE', payload: 'VIDEO' })}
          className="absolute bottom-3 right-3 bg-neutral-900/95 text-white font-bold text-[11px] px-3 py-1.5 rounded-full border border-neutral-700 shadow-xl flex items-center gap-1.5 z-30"
        >
          <Film size={12} className="text-blue-400" />
          <span>Canvas Editor</span>
          <ArrowRight size={11} className="text-neutral-400" />
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'ai' as const, icon: <Wand2 size={13} />, label: 'AI' },
    { id: 'storyboard' as const, icon: <Film size={13} />, label: 'Scenes' },
    { id: 'templates' as const, icon: <LayoutGrid size={13} />, label: 'Presets' },
    { id: 'properties' as const, icon: <Sliders size={13} />, label: 'Edit' },
    { id: 'layers' as const, icon: <Layers size={13} />, label: 'Layers' }
  ];

  return (
    <div id="mobile-workspace" className="flex-1 flex flex-col overflow-hidden relative bg-neutral-950">
      {/* Top half: Canvas with Play floating action */}
      <section id="mobile-canvas-section" className="flex-[0.52] relative border-b border-neutral-800 min-h-0">
        <CanvasArea
          project={project}
          editor={editor}
          dispatch={dispatch}
          isMobile={isMobile}
          dragState={dragState}
          setDragState={setDragState}
        />
        <button
          id="mobile-playback-fab"
          onClick={() => dispatch({ type: 'TOGGLE_PLAY' })}
          className="absolute bottom-4 right-4 w-11 h-11 bg-blue-600 rounded-full shadow-xl flex items-center justify-center text-white z-20 hover:bg-blue-500 transition-colors"
          title={editor.isPlaying ? 'Pause' : 'Play'}
        >
          {editor.isPlaying ? (
            <Pause size={18} fill="currentColor" />
          ) : (
            <Play size={18} fill="currentColor" className="ml-0.5" />
          )}
        </button>
      </section>

      {/* Bottom half: Tabs and Tab panels */}
      <section id="mobile-panels-section" className="flex-[0.48] flex flex-col min-h-0">
        <nav id="mobile-tab-nav" className="flex border-b border-neutral-800 bg-neutral-900 shrink-0 overflow-x-auto hidden-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`mobile-tab-${tab.id}`}
              onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id })}
              className={`flex-1 min-w-[60px] py-2.5 flex items-center justify-center gap-1 border-b-2 text-[10px] font-bold uppercase transition ${
                editor.activeTab === tab.id
                  ? 'border-blue-500 text-blue-400 bg-neutral-950'
                  : 'border-transparent text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div id="mobile-panel-content" className="flex-1 overflow-y-auto relative custom-scrollbar p-3">
          {editor.activeTab === 'ai' && (
            <AIPanel project={project} editor={editor} dispatch={dispatch} />
          )}
          {editor.activeTab === 'storyboard' && (
            <AIStoryboardPanel project={project} editor={editor} dispatch={dispatch} />
          )}
          {editor.activeTab === 'templates' && (
            <TemplatesAndBrandPanel project={project} editor={editor} dispatch={dispatch} />
          )}
          {editor.activeTab === 'properties' && (
            <PropertiesPanel
              project={project}
              editor={editor}
              dispatch={dispatch}
              isMobile={isMobile}
            />
          )}
          {editor.activeTab === 'layers' && (
            <LayersPanel project={project} editor={editor} dispatch={dispatch} />
          )}
        </div>
      </section>
    </div>
  );
};
