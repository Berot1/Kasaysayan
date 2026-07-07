import {
  Plus, Search, MoreVertical, FileText, FileImage, FileType2,
  UploadCloud, Loader2, PanelLeftClose, Pencil, Trash2
} from 'lucide-react';
import { ArchiveSource } from './types';

interface SourcesPanelProps {
  sources: ArchiveSource[];
  // setSources removed – not used
  sourceFilter: string;
  setSourceFilter: (v: string) => void;
  onSourceClick: (src: ArchiveSource) => void;
  openMenuIndex: number | null;
  setOpenMenuIndex: React.Dispatch<React.SetStateAction<number | null>>;
  renamingIndex: number | null;
  setRenamingIndex: React.Dispatch<React.SetStateAction<number | null>>;
  renameValue: string;
  setRenameValue: (v: string) => void;
  isDragging: boolean;
  // setIsDragging removed – not used here
  isUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDeleteSource: (idx: number) => void;
  onStartRename: (idx: number) => void;
  onCommitRename: (idx: number) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function SourcesPanel({
  sources, sourceFilter, setSourceFilter, onSourceClick, openMenuIndex,
  setOpenMenuIndex, renamingIndex, setRenamingIndex, renameValue, setRenameValue,
  isDragging, isUploading, fileInputRef, onFileUpload, onDragOver, onDragLeave,
  onDrop, onDeleteSource, onStartRename, onCommitRename, collapsed, onToggleCollapse,
}: SourcesPanelProps) {
  const getSourceIcon = (type: string) => {
    if (type === 'application/pdf') return <FileText className="w-4 h-4 text-oxblood shrink-0" />;
    if (type.startsWith('image/')) return <FileImage className="w-4 h-4 text-stone shrink-0" />;
    return <FileType2 className="w-4 h-4 text-stone shrink-0" />;
  };

  const filteredSources = sources.filter(s => s.name.toLowerCase().includes(sourceFilter.toLowerCase()));

  if (collapsed) {
    return (
      <div className="hidden md:flex flex-1 flex-col items-center py-4">
        <button onClick={onToggleCollapse} className="p-2 rounded-lg hover:bg-muted text-stone hover:text-charcoal transition-colors" aria-label="Expand sources panel">
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="h-12 border-b border-border-subtle flex items-center justify-between px-4 shrink-0">
        <h2 className="text-[14px] font-medium text-charcoal">Sources</h2>
        <div className="flex items-center gap-1">
          {sources.length > 0 && <span className="text-[12px] text-stone mr-1">{sources.length}</span>}
          <button onClick={onToggleCollapse} className="hidden md:inline-flex p-1.5 rounded-md hover:bg-muted text-stone hover:text-charcoal transition-colors" aria-label="Collapse sources panel">
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        className={`flex-1 overflow-y-auto p-4 transition-colors ${isDragging ? 'bg-oxblood-muted/40' : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input type="file" className="hidden" accept=".pdf,image/*,.txt,.doc,.docx" ref={fileInputRef} onChange={onFileUpload} />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full flex items-center justify-center gap-2 py-2.5 mb-3 bg-white border border-border-strong rounded-full text-[13px] font-medium text-charcoal shadow-sm hover:bg-muted hover:border-charcoal/30 transition-all disabled:opacity-50"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-stone" /> : <Plus className="w-4 h-4 text-stone" />}
          {isUploading ? 'Digitizing...' : 'Add sources'}
        </button>

        {sources.length > 0 && (
          <div className="relative mb-4">
            <Search className="w-3.5 h-3.5 text-stone absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              placeholder="Filter sources"
              className="w-full pl-9 pr-3 py-2 bg-surface border border-border-subtle rounded-lg text-[13px] text-charcoal placeholder:text-stone outline-none focus:border-charcoal/30 transition-colors"
            />
          </div>
        )}

        <div className="space-y-1">
          {sources.length === 0 && !isUploading && (
            <div className={`text-center py-10 px-4 rounded-xl border-2 border-dashed transition-colors ${isDragging ? 'border-oxblood bg-oxblood-muted/30' : 'border-border-subtle'}`}>
              <UploadCloud className="w-6 h-6 text-stone mx-auto mb-3" />
              <p className="text-[13px] text-charcoal font-medium mb-1">No sources yet</p>
              <p className="text-[12px] text-stone leading-relaxed">
                Drag a PDF, image, or text file here, or use &quot;Add sources&quot; above.
              </p>
            </div>
          )}

          {sources.length > 0 && filteredSources.length === 0 && (
            <p className="text-[12px] text-stone text-center py-6">
              No sources match &quot;{sourceFilter}&quot;.
            </p>
          )}

          {filteredSources.map((src) => {
            const originalIdx = sources.indexOf(src);
            return (
              <div key={originalIdx} className="relative">
                {renamingIndex === originalIdx ? (
                  <div className="flex items-center gap-3 p-2.5 rounded-lg border border-charcoal/30 bg-white">
                    {getSourceIcon(src.type)}
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => onCommitRename(originalIdx)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') onCommitRename(originalIdx);
                        if (e.key === 'Escape') setRenamingIndex(null);
                      }}
                      className="flex-1 text-[13px] bg-transparent outline-none border-b border-charcoal/20 text-charcoal min-w-0"
                    />
                  </div>
                ) : (
                  <div
                    onClick={() => onSourceClick(src)}
                    className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-muted cursor-pointer transition-colors border border-transparent hover:border-border-subtle"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {getSourceIcon(src.type)}
                      <span className="text-[13px] text-charcoal truncate font-medium">{src.name}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setOpenMenuIndex(openMenuIndex === originalIdx ? null : originalIdx); }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-stone hover:text-charcoal hover:bg-border-subtle rounded transition-all shrink-0"
                      aria-label={`Options for ${src.name}`}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {openMenuIndex === originalIdx && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setOpenMenuIndex(null)} />
                    <div className="absolute right-2 top-10 z-30 w-36 bg-white border border-border-subtle rounded-lg shadow-lg py-1">
                      <button onClick={() => onStartRename(originalIdx)} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-charcoal hover:bg-muted transition-colors">
                        <Pencil className="w-3.5 h-3.5" /> Rename
                      </button>
                      <button onClick={() => onDeleteSource(originalIdx)} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-oxblood hover:bg-oxblood-muted transition-colors">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}