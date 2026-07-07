"use client";

import { use, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useArchive } from '@/app/hooks/useArchive';
import { ArchiveHeader } from '@/app/components/archive/ArchiveHeader';
import { SourcesPanel } from '@/app/components/archive/SourcesPanel';
import { ChatPanel } from '@/app/components/archive/ChatPanel';
import { StudioPanel } from '@/app/components/archive/StudioPanel';
import { SourcePreviewModal } from '@/app/components/archive/SourcePreviewModal';
import { Toast } from '@/app/components/archive/Toast';
import type { Toast as ToastType } from '@/app/components/archive/types';

export default function ArchivePage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const archiveId = resolvedParams.id;
  const [isDraggingSource, setIsDraggingSource] = useState(false);
  const [isDraggingStudio, setIsDraggingStudio] = useState(false);

  const {
  isLoading, title, setTitle, 
  notes, activeNote, setActiveNoteId, 
  isSaving, isDirty, lastSavedAt, sources, sourceFilter, setSourceFilter, 
  previewSource, setPreviewSource, 
  openMenuIndex, setOpenMenuIndex, 
  renamingIndex, setRenamingIndex,
  renameValue, setRenameValue, 
  isDragging, setIsDragging, 
  isUploading, sourcesCollapsed, setSourcesCollapsed, 
  studioCollapsed, setStudioCollapsed, 
  mobileView, setMobileView, 
  toasts, pushToast, 
  messages, chatInput, setChatInput, 
  isSearching, fileInputRef, handleSave, handleSaveResponseToNote, handleAddNote, handleDeleteNote, 
  updateActiveNote, handleChatSubmit, handleFileUpload, processUpload, 
  handleDeleteSource, startRename, commitRename, handleClearConversation,
  sourceWidth, setSourceWidth,
  studioWidth, setStudioWidth,
} = useArchive(archiveId);

  // Keyboard shortcuts: Cmd/Ctrl+S to save
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleSave]);

  // Escape to close preview
  useEffect(() => {
    if (!previewSource) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewSource(null);
    };
    window.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [previewSource, setPreviewSource]);

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      // Cancel any pending frames so we don't queue up multiple updates
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      // Schedule the width update for the next browser repaint
      animationFrameId = requestAnimationFrame(() => {
        if (isDraggingSource) {
          const newWidth = Math.min(Math.max(e.clientX, 200), 600);
          setSourceWidth(newWidth);
        }
        if (isDraggingStudio) {
          const newWidth = Math.min(Math.max(window.innerWidth - e.clientX, 200), 600);
          setStudioWidth(newWidth);
        }
      });
    };

    const handleMouseUp = () => {
      setIsDraggingSource(false);
      setIsDraggingStudio(false);
    };

    if (isDraggingSource || isDraggingStudio) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none'; // Prevent text selection while dragging
    } else {
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [isDraggingSource, isDraggingStudio, setSourceWidth, setStudioWidth]);useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSource) {
        // Constrain source panel between 200px and 600px
        const newWidth = Math.min(Math.max(e.clientX, 200), 600);
        setSourceWidth(newWidth);
      }
      if (isDraggingStudio) {
        // Constrain studio panel between 200px and 600px
        const newWidth = Math.min(Math.max(window.innerWidth - e.clientX, 200), 600);
        setStudioWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingSource(false);
      setIsDraggingStudio(false);
    };

    if (isDraggingSource || isDraggingStudio) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none'; // Prevent text selection while dragging
    } else {
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [isDraggingSource, isDraggingStudio, setSourceWidth, setStudioWidth]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-3 bg-paper text-charcoal">
        <Loader2 className="animate-spin w-6 h-6 text-oxblood" />
        <p className="text-[13px] text-stone">Opening archive…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-paper text-charcoal font-sans selection:bg-muted relative overflow-hidden">
      {/* Toasts */}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-xs pointer-events-none">
        {toasts.map((t: ToastType) => <Toast key={t.id} toast={t} />)}
      </div>

      <SourcePreviewModal source={previewSource} onClose={() => setPreviewSource(null)} />

      <ArchiveHeader
        title={title}
        setTitle={setTitle}
        isSaving={isSaving}
        isDirty={isDirty}
        lastSavedAt={lastSavedAt}
        onSave={handleSave}
      />

      <div className="md:hidden flex border-b border-border-subtle bg-surface shrink-0 z-10">
        {(['sources', 'chat', 'studio'] as const).map(view => (
          <button
            key={view}
            onClick={() => setMobileView(view)}
            className={`flex-1 py-2.5 text-[13px] font-medium capitalize border-b-2 transition-colors ${
              mobileView === view ? 'border-oxblood text-oxblood' : 'border-transparent text-stone'
            }`}
          >
            {view === 'sources' ? `Sources${sources.length ? ` (${sources.length})` : ''}` : view}
          </button>
        ))}
      </div>

        {/* Main Layout Area */}
        <main className="flex-1 flex p-3 overflow-hidden min-h-0"> 
          {/* Sources Panel */}
          <section 
              className={`${mobileView === 'sources' ? 'flex' : 'hidden'} md:flex ${sourcesCollapsed ? 'md:w-14' : 'w-full'} flex-col bg-white rounded-2xl border border-border-subtle shadow-sm shrink-0 transition-[width] duration-200 overflow-hidden`}
              style={{ width: !sourcesCollapsed ? sourceWidth : undefined }}
            >
              <SourcesPanel
                sources={sources}
                sourceFilter={sourceFilter}
                setSourceFilter={setSourceFilter}
                onSourceClick={setPreviewSource}
                openMenuIndex={openMenuIndex}
                setOpenMenuIndex={setOpenMenuIndex}
                renamingIndex={renamingIndex}
                setRenamingIndex={setRenamingIndex}
                renameValue={renameValue}
                setRenameValue={setRenameValue}
                isDragging={isDragging}
                isUploading={isUploading}
                fileInputRef={fileInputRef}
                onFileUpload={handleFileUpload}
                onDragOver={(e) => { e.preventDefault(); if (!isDragging) setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files?.[0]; if (file) processUpload(file); }}
                onDeleteSource={handleDeleteSource}
                onStartRename={startRename}
                onCommitRename={commitRename}
                collapsed={sourcesCollapsed}
                onToggleCollapse={() => setSourcesCollapsed(!sourcesCollapsed)}
              />
          </section>

            {/* Source Resizer Handle */}
            {!sourcesCollapsed ? (
              <div 
                className="hidden md:block w-3 cursor-col-resize hover:bg-border-subtle/50 transition-colors mx-1 rounded-full shrink-0"
                onMouseDown={() => setIsDraggingSource(true)}
              />
            ) : (
              <div className="hidden md:block w-3 mx-1 shrink-0" /> /* Fallback spacing when collapsed */
            )}

            {/* Chat Panel */}
            <section className={`${mobileView === 'chat' ? 'flex' : 'hidden'} md:flex flex-1 flex-col min-w-0` }>
              <ChatPanel
                messages={messages}
                isSearching={isSearching}
                chatInput={chatInput}
                setChatInput={setChatInput}
                onSendMessage={handleChatSubmit}
                onClearConversation={handleClearConversation}
                onSaveResponseToNote={handleSaveResponseToNote}
                sourcesCount={sources.length}
                onPushToast={pushToast}
              />
            </section>

            {/* Studio Resizer Handle */}
            {!studioCollapsed ? (
              <div 
                className="hidden md:block w-3 cursor-col-resize hover:bg-border-subtle/50 transition-colors mx-1 rounded-full shrink-0"
                onMouseDown={() => setIsDraggingStudio(true)}
              />
            ) : (
              <div className="hidden md:block w-3 mx-1 shrink-0" /> /* Fallback spacing when collapsed */
            )}

            {/* Studio Panel */}
            <section 
              className={`${mobileView === 'studio' ? 'flex' : 'hidden'} md:flex ${studioCollapsed ? 'md:w-14' : 'w-full'} flex-col bg-white rounded-2xl border border-border-subtle shadow-sm shrink-0 transition-[width] duration-200 overflow-hidden`}
              style={{ width: !studioCollapsed ? studioWidth : undefined }}
            >
              <StudioPanel
                activeNote={activeNote}
                setActiveNoteId={setActiveNoteId}
                notes={notes}
                onAddNote={handleAddNote}
                onDeleteNote={handleDeleteNote}
                updateActiveNote={updateActiveNote}
                isSaving={isSaving}
                isDirty={isDirty}
                onPushToast={pushToast}
                collapsed={studioCollapsed}
                onToggleCollapse={() => setStudioCollapsed(!studioCollapsed)}
              />
            </section>
        </main>
    </div>
  );
}