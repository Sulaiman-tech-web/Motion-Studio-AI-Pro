import React from 'react';
import {
  Sparkles,
  FileText,
  Film,
  FileCode,
  Image as ImageIcon,
  Mic,
  Music,
  Zap,
  ShieldCheck,
  Smartphone,
  Database,
  Repeat,
  Shield
} from 'lucide-react';
import { ProjectState, EditorState, EditorAction, CreateSubTab } from '../../types';
import { CreativeBriefPanel } from './CreativeBriefPanel';
import { AIStoryboardV2Panel } from './AIStoryboardV2Panel';
import { ScriptTimingPanel } from './ScriptTimingPanel';
import { GenerativeMediaStorePanel } from './GenerativeMediaStorePanel';
import { VoiceStudioPanel } from './VoiceStudioPanel';
import { SoundMusicPanel } from './SoundMusicPanel';
import { AutoAssemblyPanel } from './AutoAssemblyPanel';
import { QualityInspectorPanel } from './QualityInspectorPanel';
import { SocialVariantsPanel } from './SocialVariantsPanel';
import { BatchStudioPanel } from './BatchStudioPanel';
import { StockCreatorPanel } from './StockCreatorPanel';
import { BrandGuardrailsPanel } from './BrandGuardrailsPanel';

interface CreateWorkspaceProps {
  project: ProjectState;
  editor: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

export const CreateWorkspace: React.FC<CreateWorkspaceProps> = ({
  project,
  editor,
  dispatch
}) => {
  const activeTab: CreateSubTab = editor.createSubTab || 'brief';

  const subTabs: { id: CreateSubTab; label: string; icon: React.ComponentType<any> }[] = [
    { id: 'brief', label: 'Creative Brief', icon: FileText },
    { id: 'storyboard', label: 'Storyboard V2', icon: Film },
    { id: 'script', label: 'Script & Timing', icon: FileCode },
    { id: 'media', label: 'Generative Studio', icon: ImageIcon },
    { id: 'voice', label: 'AI Voiceover', icon: Mic },
    { id: 'audio', label: 'SFX & Music', icon: Music },
    { id: 'autobuild', label: 'Auto Assembly', icon: Zap },
    { id: 'review', label: 'Quality Review', icon: ShieldCheck },
    { id: 'variants', label: 'Social Variants', icon: Smartphone },
    { id: 'batch', label: 'Batch Studio', icon: Database },
    { id: 'stock', label: 'Stock Loops', icon: Repeat },
    { id: 'brand', label: 'Brand Kit V2', icon: Shield }
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-neutral-950">
      {/* Horizontal Sub-Navigation Tab Bar */}
      <div className="bg-neutral-900 border-b border-neutral-800 px-3 py-1.5 flex items-center gap-1 overflow-x-auto scrollbar-none shrink-0 z-10">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => dispatch({ type: 'SET_CREATE_SUB_TAB', payload: tab.id })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850'
              }`}
            >
              <Icon size={13} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Tab Panel Body */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'brief' && (
          <CreativeBriefPanel project={project} editor={editor} dispatch={dispatch} />
        )}
        {activeTab === 'storyboard' && (
          <AIStoryboardV2Panel project={project} editor={editor} dispatch={dispatch} />
        )}
        {activeTab === 'script' && (
          <ScriptTimingPanel project={project} editor={editor} dispatch={dispatch} />
        )}
        {activeTab === 'media' && (
          <GenerativeMediaStorePanel project={project} editor={editor} dispatch={dispatch} />
        )}
        {activeTab === 'voice' && (
          <VoiceStudioPanel project={project} editor={editor} dispatch={dispatch} />
        )}
        {activeTab === 'audio' && (
          <SoundMusicPanel project={project} editor={editor} dispatch={dispatch} />
        )}
        {activeTab === 'autobuild' && (
          <AutoAssemblyPanel project={project} editor={editor} dispatch={dispatch} />
        )}
        {activeTab === 'review' && (
          <QualityInspectorPanel project={project} editor={editor} dispatch={dispatch} />
        )}
        {activeTab === 'variants' && (
          <SocialVariantsPanel project={project} editor={editor} dispatch={dispatch} />
        )}
        {activeTab === 'batch' && (
          <BatchStudioPanel project={project} editor={editor} dispatch={dispatch} />
        )}
        {activeTab === 'stock' && (
          <StockCreatorPanel project={project} editor={editor} dispatch={dispatch} />
        )}
        {activeTab === 'brand' && (
          <BrandGuardrailsPanel project={project} editor={editor} dispatch={dispatch} />
        )}
      </div>
    </div>
  );
};
