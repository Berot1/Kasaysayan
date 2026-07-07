import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import { ArchiveSource, Note, Citation, Toast } from '@/app/components/archive/types';
import { genId, deriveNoteTitle } from '@/app/components/archive/helpers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

export function useArchive(archiveId: string) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Archive data
  const [title, setTitle] = useState('Loading...');
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // Sources
  const [sources, setSources] = useState<ArchiveSource[]>([]);
  const [sourceFilter, setSourceFilter] = useState('');
  const [previewSource, setPreviewSource] = useState<ArchiveSource | null>(null);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [renamingIndex, setRenamingIndex] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [sourcesCollapsed, setSourcesCollapsed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Studio panel
  const [studioCollapsed, setStudioCollapsed] = useState(false);

  // Panel widths (default 300px)
  const [sourceWidth, setSourceWidth] = useState(300);
  const [studioWidth, setStudioWidth] = useState(300);

  // Mobile view
  const [mobileView, setMobileView] = useState<'sources' | 'chat' | 'studio'>('chat');

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  const pushToast = useCallback((type: 'success' | 'error', message: string) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  // Chat
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string, citations?: Citation[] }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Fetch data (unchanged)
  useEffect(() => {
    const fetchArchiveAndDocument = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
        return;
      }
      setSession(session);

      try {
        const archiveRes = await fetch(`${BACKEND_URL}/api/archives/${archiveId}`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });

        if (archiveRes.ok) {
          const data = await archiveRes.json();
          setTitle(data.title);
          if (Array.isArray(data.notes) && data.notes.length > 0) {
            setNotes(data.notes);
          } else if (data.content) {
            const now = new Date().toISOString();
            setNotes([{
              id: genId(),
              title: data.title || 'Untitled note',
              content: data.content,
              fromChat: false,
              createdAt: now,
              updatedAt: now,
            }]);
          }
          setLastSavedAt(new Date());
        } else {
          router.push('/dashboard');
        }

        const docRes = await fetch(`${BACKEND_URL}/api/archives/${archiveId}/document`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });

        if (docRes.ok) {
          const docData = await docRes.json();
          if (docData.text) {
            const blob = new Blob([docData.text], { type: 'text/plain' });
            setSources([{
              name: docData.filename || 'Historical_Document.txt',
              url: URL.createObjectURL(blob),
              type: 'text/plain',
              rawText: docData.text
            }]);
          }
        }
      } catch (error) {
        console.error("Failed to load archive data:", error);
        pushToast('error', 'Could not load this archive. Check your connection and try again.');
      }
      setIsLoading(false);
    };
    fetchArchiveAndDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archiveId, router]);

  const persistArchive = async (newTitle: string, newNotes: Note[]) => {
    if (!session) return false;
    try {
      const res = await fetch(`${BACKEND_URL}/api/archives/${archiveId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({ title: newTitle, notes: newNotes })
      });
      return res.ok;
    } catch (error) {
      console.error("Failed to save:", error);
      return false;
    }
  };

  const handleSave = useCallback(async () => {
    if (!session) return;
    setIsSaving(true);
    const ok = await persistArchive(title, notes);
    if (ok) {
      setIsDirty(false);
      setLastSavedAt(new Date());
    } else {
      pushToast('error', 'Failed to save your changes. Please try again.');
    }
    setIsSaving(false);
  }, [session, archiveId, title, notes, pushToast]);

  const handleSaveResponseToNote = async (content: string, citations?: Citation[]) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      id: genId(),
      title: deriveNoteTitle(content),
      content,
      citations,
      fromChat: true,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    setIsDirty(true);
    pushToast('success', 'Saved to notes.');
    setIsSaving(true);
    const ok = await persistArchive(title, updated);
    if (ok) {
      setIsDirty(false);
      setLastSavedAt(new Date());
    }
    setIsSaving(false);
  };

  const activeNote = notes.find(n => n.id === activeNoteId) || null;

  const openNote = (id: string) => {
    setActiveNoteId(id);
  };

  const handleAddNote = () => {
    const now = new Date().toISOString();
    const newNote: Note = {
      id: genId(),
      title: 'New note',
      content: '',
      fromChat: false,
      createdAt: now,
      updatedAt: now,
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeNoteId === id) setActiveNoteId(null);
    setIsDirty(true);
  };

  const updateActiveNote = (patch: Partial<Pick<Note, 'title' | 'content'>>) => {
    if (!activeNoteId) return;
    const now = new Date().toISOString();
    setNotes(prev => prev.map(n => (n.id === activeNoteId ? { ...n, ...patch, updatedAt: now } : n)));
    setIsDirty(true);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !session) return;

    const userQuery = chatInput;
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setChatInput('');
    setIsSearching(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({ query: userQuery, filter: { archive_id: archiveId } }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer || "No response generated.",
        citations: Array.isArray(data.citations) ? data.citations : [],
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'System error: could not reach the intelligence engine.' }]);
    }
    setIsSearching(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    await processUpload(selectedFile);
  };

  const processUpload = async (file: File) => {
    if (!file || !session) return;
    const objectUrl = URL.createObjectURL(file);
    const newSource: ArchiveSource = { name: file.name, url: objectUrl, type: file.type || 'application/octet-stream' };
    setSources(prev => [...prev, newSource]);

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('archive_id', archiveId);

    try {
      const res = await fetch(`${BACKEND_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
        body: formData
      });
      if (!res.ok) {
        pushToast('error', `Failed to process "${file.name}".`);
      } else {
        pushToast('success', `"${file.name}" added to sources.`);
      }
    } catch (err) {
      console.error("Upload failed", err);
      pushToast('error', `Could not upload "${file.name}". Check your connection.`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteSource = (idx: number) => {
    setSources(prev => {
      const removed = prev[idx];
      if (removed) {
        if (previewSource === removed) setPreviewSource(null);
        pushToast('success', `Removed "${removed.name}".`);
      }
      return prev.filter((_, i) => i !== idx);
    });
    setOpenMenuIndex(null);
  };

  const startRename = (idx: number) => {
    setRenamingIndex(idx);
    setRenameValue(sources[idx].name);
    setOpenMenuIndex(null);
  };

  const commitRename = (idx: number) => {
    setSources(prev => prev.map((s, i) => (i === idx ? { ...s, name: renameValue.trim() || s.name } : s)));
    setRenamingIndex(null);
  };

  const handleClearConversation = () => {
    setMessages([]);
  };

  return {
    // State
    session,
    isLoading,
    title,
    notes,
    activeNote,
    activeNoteId,
    setActiveNoteId,
    isSaving,
    isDirty,
    lastSavedAt,
    sources,
    sourceFilter,
    setSourceFilter,
    previewSource,
    setPreviewSource,
    openMenuIndex,
    setOpenMenuIndex,
    renamingIndex,
    setRenamingIndex,
    renameValue,
    setRenameValue,
    isDragging,
    setIsDragging,
    isUploading,
    sourcesCollapsed,
    setSourcesCollapsed,
    studioCollapsed,
    setStudioCollapsed,
    sourceWidth,
    setSourceWidth,
    studioWidth,
    setStudioWidth,
    mobileView,
    setMobileView,
    toasts,
    pushToast,
    messages,
    chatInput,
    setChatInput,
    isSearching,
    fileInputRef,

    // Actions
    setTitle,
    setNotes,
    setSources,
    handleSave,
    handleSaveResponseToNote,
    handleAddNote,
    handleDeleteNote,
    updateActiveNote,
    handleChatSubmit,
    handleFileUpload,
    processUpload,
    handleDeleteSource,
    startRename,
    commitRename,
    handleClearConversation,
  };
}