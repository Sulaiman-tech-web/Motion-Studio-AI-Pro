import React from 'react';
import {
  Wand2,
  Film,
  LayoutGrid,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ProjectState, EditorState, EditorAction } from '../types';
import { CanvasArea } from './CanvasArea';
import { Timeline } from './Timeline';
import { PropertiesPanel } from './PropertiesPanel';
import { AIPanel } from './AIPanel';
import { AIStoryboardPanel } from './AIStoryboardPanel';
import { TemplatesAndBrandPanel } from './TemplatesAndBrandPanel';
import { LayersPanel } from './LayersPanel';
import { CreateWorkspace } from './creative/CreateWorkspace';

interface DesktopWorkspaceProps {
  project: ProjectState;
  editor: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  isMobile: boolean;
  dragState: any;
  setDragState: React.Dispatch<React.SetStateAction<any>>;
}

export const DesktopWorkspace: React.FC<DesktopWorkspaceProps> = ({
  project,
  editor,
  dispatch,
  isMobile,
  dragState,
  setDragState
}) => {
  // If in CREATE mode, render the full AI Creative Production System
  if (editor.workspaceMode === 'CREATE') {
    return (
      <div id="desktop-workspace-create" className="flex-1 flex flex-col overflow-hidden relative">
        <CreateWorkspace project={project} editor={editor} dispatch={dispatch} />
        {/* Floating Quick Jump to Canvas Timeline */}
        <button
          onClick={() => dispatch({ type: 'SET_WORKSPACE_MODE', payload: 'VIDEO' })}
          className="absolute bottom-4 right-6 bg-neutral-900/90 hover:bg-neutral-800 text-white font-bold text-xs px-4 py-2 rounded-full border border-neutral-700 shadow-2xl flex items-center gap-2 transition z-30 group"
          title="Open Video Sequencing Timeline & Canvas"
        >
          <Film size={14} className="text-blue-400" />
          <span>Open Canvas & Timeline</span>
          <ArrowRight size={13} className="text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'ai' as const, icon: <Wand2 size={14} />, label: 'AI Motion' },
    { id: 'storyboard' as const, icon: <Film size={14} />, label: 'Storyboard' },
    { id: 'templates' as const, icon: <LayoutGrid size={14} />, label: 'Presets' },
    { id: 'layers' as const, icon: <Layers size={14} />, label: 'Layers' }
  ];

  return (
    <div id="desktop-workspace" className="flex-1 flex overflow-hidden relative">
      {/* Left Sidebar (AI Director, Storyboard, Templates & Layers) */}
      <aside id="desktop-left-sidebar" className="w-80 bg-neutral-950 border-r border-neutral-800 flex flex-col shrink-0">
        <nav id="desktop-tab-nav" className="flex border-b border-neutral-800 bg-neutral-900/60 overflow-x-auto hidden-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id })}
              className={`flex-1 min-w-[72px] py-3 flex items-center justify-center gap-1.5 border-b-2 text-[11px] font-bold uppercase transition tracking-wide ${
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

        <div id="desktop-sidebar-content" className="flex-1 overflow-y-auto p-3.5 custom-scrollbar">
          {editor.activeTab === 'ai' && (
            <AIPanel project={project} editor={editor} dispatch={dispatch} />
          )}
          {editor.activeTab === 'storyboard' && (
            <AIStoryboardPanel project={project} editor={editor} dispatch={dispatch} />
          )}
          {editor.activeTab === 'templates' && (
            <TemplatesAndBrandPanel project={project} editor={editor} dispatch={dispatch} />
          )}
          {editor.activeTab === 'layers' && (
            <LayersPanel project={project} editor={editor} dispatch={dispatch} />
          )}
        </div>
      </aside>

      {/* Center Area: Canvas + Timeline */}
      <main id="desktop-center-stage" className="flex-1 flex flex-col min-w-0">
        <CanvasArea
          project={project}
          editor={editor}
          dispatch={dispatch}
          isMobile={isMobile}
          dragState={dragState}
          setDragState={setDragState}
        />
        <Timeline
          project={project}
          editor={editor}
          dispatch={dispatch}
          setDragState={setDragState}
        />
      </main>

      {/* Right Sidebar: Properties Panel */}
      <aside id="desktop-properties-sidebar" className="w-80 bg-neutral-950 border-l border-neutral-800 flex flex-col shrink-0">
        <PropertiesPanel
          project={project}
          editor={editor}
          dispatch={dispatch}
          isMobile={isMobile}
        />
      </aside>
    </div>
  );
};

