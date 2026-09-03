import React, { useState } from 'react';
import {
  Database,
  Plus,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Trash2,
  Eye,
  Layers
} from 'lucide-react';
import { ProjectState, EditorState, EditorAction, BatchDatasetRow } from '../../types';
import { generateId } from '../../utils/animation';

interface BatchStudioPanelProps {
  project: ProjectState;
  editor: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

export const BatchStudioPanel: React.FC<BatchStudioPanelProps> = ({
  project,
  editor,
  dispatch
}) => {
  const rows = editor.batchDataset || [];
  const [selectedRowId, setSelectedRowId] = useState<string>(rows[0]?.id || '');
  const [isBatchRendering, setIsBatchRendering] = useState(false);

  const handleSelectPreviewRow = (row: BatchDatasetRow) => {
    setSelectedRowId(row.id);
    // Dynamically inject row data into existing text layers (respecting {{product_name}}, {{price}}, etc.)
    const updatedLayers = project.layers.map((l) => {
      if (l.id.includes('title') || l.name.toLowerCase().includes('title')) {
        return { ...l, text: row.productName.toUpperCase() };
      }
      if (l.id.includes('sub') || l.name.toLowerCase().includes('tagline')) {
        return { ...l, text: `${row.headline} • ${row.price}` };
      }
      return l;
    });
    dispatch({ type: 'UPDATE_PROJECT_SETTINGS', payload: { layers: updatedLayers } as any });
  };

  const handleAddRow = () => {
    const newRow: BatchDatasetRow = {
      id: `batch_${generateId()}`,
      productName: 'Aura Neo Carbon',
      price: '$299',
      headline: 'LIGHTWEIGHT CARBON COMPOSITE',
      productImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
      cta: 'Pre-Order Today',
      status: 'Ready'
    };
    dispatch({ type: 'SET_BATCH_DATASET', payload: [...rows, newRow] });
  };

  const handleDeleteRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = rows.filter((r) => r.id !== id);
    dispatch({ type: 'SET_BATCH_DATASET', payload: updated });
  };

  const handleRunBatchRender = () => {
    setIsBatchRendering(true);
    let index = 0;

    const interval = setInterval(() => {
      if (index < rows.length) {
        const target = rows[index];
        dispatch({
          type: 'UPDATE_BATCH_ROW',
          payload: { id: target.id, updates: { status: 'Complete' } }
        });
        index++;
      } else {
        clearInterval(interval);
        setIsBatchRendering(false);
      }
    }, 800);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4 text-neutral-200">
      {/* Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Database size={16} className="text-emerald-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Batch Studio & Data-Driven Video Engine
            </h2>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Automate hundreds of personalized SKU product videos from CSV, spreadsheets, or catalog tables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddRow}
            className="text-xs bg-neutral-800 hover:bg-neutral-750 text-neutral-200 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 border border-neutral-750"
          >
            <Plus size={13} />
            <span>Add Row</span>
          </button>

          <button
            onClick={handleRunBatchRender}
            disabled={isBatchRendering || rows.length === 0}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow-lg shadow-emerald-900/30 disabled:opacity-50"
          >
            {isBatchRendering ? <RotateCcw size={13} className="animate-spin" /> : <Play size={13} />}
            <span>{isBatchRendering ? 'Rendering Batch...' : `Batch Render (${rows.length} SKUs)`}</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet / Matrix Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] font-mono border-b border-neutral-800">
              <tr>
                <th className="p-3">Preview</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Headline</th>
                <th className="p-3">Call to Action</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-sans">
              {rows.map((row) => {
                const isSelected = selectedRowId === row.id;
                const isOverflow = row.headline.length > 35;

                return (
                  <tr
                    key={row.id}
                    onClick={() => handleSelectPreviewRow(row)}
                    className={`cursor-pointer transition ${
                      isSelected ? 'bg-blue-500/15' : 'hover:bg-neutral-850/50'
                    }`}
                  >
                    <td className="p-3">
                      <button
                        className={`p-1.5 rounded text-xs transition ${
                          isSelected ? 'text-blue-400 bg-blue-500/20' : 'text-neutral-500 hover:text-white'
                        }`}
                        title="Click to live-preview this SKU in Canvas"
                      >
                        <Eye size={14} />
                      </button>
                    </td>

                    <td className="p-3 font-semibold text-white">
                      <input
                        type="text"
                        value={row.productName}
                        onChange={(e) =>
                          dispatch({
                            type: 'UPDATE_BATCH_ROW',
                            payload: { id: row.id, updates: { productName: e.target.value } }
                          })
                        }
                        className="bg-transparent border-b border-transparent focus:border-blue-500 outline-none w-full"
                      />
                    </td>

                    <td className="p-3 font-mono text-emerald-400">
                      <input
                        type="text"
                        value={row.price}
                        onChange={(e) =>
                          dispatch({
                            type: 'UPDATE_BATCH_ROW',
                            payload: { id: row.id, updates: { price: e.target.value } }
                          })
                        }
                        className="bg-transparent border-b border-transparent focus:border-blue-500 outline-none w-20"
                      />
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={row.headline}
                          onChange={(e) =>
                            dispatch({
                              type: 'UPDATE_BATCH_ROW',
                              payload: { id: row.id, updates: { headline: e.target.value } }
                            })
                          }
                          className="bg-transparent border-b border-transparent focus:border-blue-500 outline-none w-full"
                        />
                        {isOverflow && (
                          <span
                            title="Text may overflow on mobile canvas"
                            className="text-amber-400 shrink-0 cursor-help"
                          >
                            <AlertCircle size={13} />
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3 text-neutral-300">
                      <input
                        type="text"
                        value={row.cta}
                        onChange={(e) =>
                          dispatch({
                            type: 'UPDATE_BATCH_ROW',
                            payload: { id: row.id, updates: { cta: e.target.value } }
                          })
                        }
                        className="bg-transparent border-b border-transparent focus:border-blue-500 outline-none w-full"
                      />
                    </td>

                    <td className="p-3">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          row.status === 'Complete'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={(e) => handleDeleteRow(row.id, e)}
                        className="text-neutral-500 hover:text-rose-400 p-1 rounded transition"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
