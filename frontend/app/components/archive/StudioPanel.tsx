import { useState, useEffect, } from 'react';
import {
  PanelRightClose, Trash2, PenLine, BookOpen,
  MoreVertical, Plus, ChevronLeft, Undo2, Redo2, Bold, Italic,
  Link2, Code, Code2, List, ListOrdered, Quote, Minus, Eraser,
  ChevronDown, CheckCircle2, Loader2, Lock, Network, Layers, History,
  HelpCircle, Users, FileText,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { citedMarkdownComponents } from './CitationChip';
import { Note } from './types';
import { timeAgo } from './helpers';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

const STUDIO_TOOLS = [
  { key: 'reports', label: 'Reports', icon: FileText },
  { key: 'mindmap', label: 'Mind Map', icon: Network },
  { key: 'flashcards', label: 'Flashcards', icon: Layers },
  { key: 'timeline', label: 'Timeline', icon: History },
  { key: 'quiz', label: 'Quiz', icon: HelpCircle },
  { key: 'figures', label: 'Key Figures', icon: Users },
] as const;

interface StudioPanelProps {
  activeNote: Note | null;
  setActiveNoteId: (id: string | null) => void;
  notes: Note[];
  onAddNote: () => void;
  onDeleteNote: (id: string) => void;
  updateActiveNote: (patch: Partial<Pick<Note, 'title' | 'content'>>) => void;
  isSaving: boolean;
  isDirty: boolean;
  onPushToast: (type: 'success' | 'error', msg: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function StudioPanel({
  activeNote,
  setActiveNoteId,
  notes,
  onAddNote,
  onDeleteNote,
  updateActiveNote,
  isSaving,
  isDirty,
  onPushToast,
  collapsed,
  onToggleCollapse,
}: StudioPanelProps) {

  const [openNoteMenuId, setOpenNoteMenuId] = useState<string | null>(null);

  const [isPreview, setIsPreview] = useState(false);

  const openNote = (id: string) => {
    setActiveNoteId(id);
    setOpenNoteMenuId(null);
  };

  const editor = useEditor({
    extensions: [
    StarterKit,
    Link.configure({
      openOnClick: false, // Prevents jumping to the link while you're editing
    }),
  ],
    content: activeNote?.content || '',
    editorProps: {
      attributes: {
        class: 'w-full h-full p-4 pb-8 outline-none text-[14px] leading-relaxed text-charcoal prose prose-sm max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      updateActiveNote({ content: editor.getHTML() });
    },
  });

  useEffect(() => {
    if (editor && activeNote && editor.getHTML() !== activeNote.content) {
      editor.commands.setContent(activeNote.content);
    }
  }, [activeNote, editor]);
  
  const wordCount = activeNote?.content.trim() ? activeNote.content.trim().split(/\s+/).length : 0;

  if (collapsed) {
    // Helper to open panel then process the tool
    const handleToolClick = (label: string) => {
      onToggleCollapse(); // 1. Expand the panel
      
      // 2. Wait for the 200ms slide animation to finish, then process
      setTimeout(() => {
        onPushToast('success', `${label} is coming soon.`);
        // Note: When you build the real tool logic, call it here!
      }, 200); 
    };

    // Helper to open panel then add a note
    const handleAddNoteClick = () => {
      onToggleCollapse();
      setTimeout(() => {
        onAddNote();
      }, 200);
    };

    return (
      <div className="hidden md:flex flex-1 flex-col items-center py-4">
        {/* Top Toggle */}
        <button 
          onClick={onToggleCollapse} 
          className="text-stone hover:text-charcoal p-1.5 rounded-lg hover:bg-black/5 transition-colors mb-3 shrink-0"
          title="Expand Studio"
        >
          <PanelRightClose className="w-5 h-5" />
        </button>
        <hr className="w-8 border-border-subtle mb-3" />

        {/* The 6 Studio Tools */}
        <div className="flex-1 overflow-y-auto no-scrollbar w-full px-2 flex flex-col items-center gap-2.5">
          {STUDIO_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <button 
                key={tool.key}
                title={tool.label}
                onClick={() => handleToolClick(tool.label)}
                className="w-10 h-10 rounded-xl bg-oxblood-muted flex items-center justify-center transition-transform hover:scale-105 shrink-0 border border-transparent hover:border-charcoal/10"
              >
                <Icon className="w-[18px] h-[18px] text-oxblood" strokeWidth={2} />
              </button>
            );
          })}
        </div>

        <hr className="w-8 border-border-subtle my-3 shrink-0" />
        
        {/* Add Note FAB */}
        <div className="flex flex-col items-center gap-4 shrink-0 pb-2">
          <button 
            onClick={handleAddNoteClick}
            title="Add note"
            className="mt-2 w-10 h-10 bg-charcoal text-background rounded-full flex items-center justify-center hover:bg-black transition-colors shadow-sm group"
          >
            <Plus className="w-5 h-5 group-hover:scale-95 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // If no note is active, show the tools + note list
  if (!activeNote) {
    return (
      <>
        <div className="h-12 border-b border-border-subtle flex items-center justify-between px-4 shrink-0">
          <h2 className="text-[14px] font-medium text-charcoal">Studio</h2>
          <button onClick={onToggleCollapse} className="hidden md:inline-flex p-1.5 rounded-md hover:bg-muted text-stone hover:text-charcoal transition-colors" aria-label="Collapse studio panel">
            <PanelRightClose className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <p className="text-[11px] font-medium text-stone uppercase tracking-wide mb-2 px-0.5">Generate</p>
            <div className="grid grid-cols-2 gap-2">
              {STUDIO_TOOLS.map(tool => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.key}
                    onClick={() => onPushToast('success', `${tool.label} is coming soon.`)}
                    className="flex flex-col items-start gap-2 p-3 rounded-xl border border-border-subtle hover:border-charcoal/30 hover:bg-muted/60 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-oxblood-muted flex items-center justify-center">
                      <Icon className="w-4 h-4 text-oxblood" />
                    </div>
                    <span className="text-[12.5px] font-medium text-charcoal leading-tight">{tool.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-medium text-stone uppercase tracking-wide mb-2 px-0.5">Notes</p>
            {notes.length === 0 ? (
              <p className="text-[12px] text-stone px-1 py-3">No notes yet — save a response or add one below.</p>
            ) : (
              <div className="space-y-1 mb-3">
                {[...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map(note => (
                  <div key={note.id} className="relative group">
                    <button
                      onClick={() => openNote(note.id)}
                      className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        {note.fromChat ? <BookOpen className="w-4 h-4 text-oxblood" /> : <PenLine className="w-4 h-4 text-charcoal" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-charcoal truncate pr-5">{note.title || 'Untitled note'}</p>
                        <p className="text-[11px] text-stone mt-0.5">{timeAgo(note.updatedAt)}</p>
                      </div>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setOpenNoteMenuId(openNoteMenuId === note.id ? null : note.id); }}
                      className="absolute right-1.5 top-1.5 opacity-0 group-hover:opacity-100 p-1 text-stone hover:text-charcoal hover:bg-border-subtle rounded transition-all"
                      aria-label={`Options for ${note.title}`}
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                    {openNoteMenuId === note.id && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setOpenNoteMenuId(null)} />
                        <div className="absolute right-1.5 top-8 z-30 w-32 bg-white border border-border-subtle rounded-lg shadow-lg py-1">
                          <button
                            onClick={() => { onDeleteNote(note.id); setOpenNoteMenuId(null); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-[12.5px] text-oxblood hover:bg-oxblood-muted transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={onAddNote}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-charcoal hover:bg-black text-background rounded-full text-[13px] font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add note
            </button>
          </div>
        </div>
      </>
    );
  }

  // Active note view
  return (
    <>
      <div className="border-b border-border-subtle shrink-0">
        <div className="h-9 flex items-center px-4 pt-2">
          <button
            onClick={() => setActiveNoteId(null)}
            className="flex items-center gap-1 text-[11px] text-stone hover:text-charcoal transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Studio <span className="text-stone">&gt;</span> <span className="text-charcoal font-medium">Note</span>
          </button>
        </div>
        <div className="flex items-center justify-between gap-2 px-4 pb-3">
          <input
            value={activeNote.title}
            onChange={(e) => updateActiveNote({ title: e.target.value })}
            aria-label="Note title"
            disabled={activeNote.fromChat}
            className="min-w-0 flex-1 font-display font-medium text-charcoal text-[19px] bg-transparent outline-none border-b border-transparent focus:border-charcoal/30 truncate disabled:cursor-text"
          />
          <button onClick={() => onDeleteNote(activeNote.id)} className="p-1.5 rounded-md hover:bg-oxblood-muted text-stone hover:text-oxblood transition-colors shrink-0" aria-label="Delete note">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {!activeNote.fromChat && (
          <div className="flex items-center gap-0.5 px-3 pb-2 flex-wrap">
            {/* Undo / Redo */}
            <button onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().undo()} className="p-1.5 rounded-md text-stone hover:text-charcoal hover:bg-muted disabled:opacity-50 transition-colors shrink-0">
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().redo()} className="p-1.5 rounded-md text-stone hover:text-charcoal hover:bg-muted disabled:opacity-50 transition-colors shrink-0">
              <Redo2 className="w-3.5 h-3.5" />
            </button>
            
            {/* Preview Toggle */}
            <button 
              onClick={() => setIsPreview(!isPreview)} 
              className={`px-2 py-1 text-[12px] font-medium rounded-md transition-colors shrink-0 ${isPreview ? 'bg-charcoal text-white' : 'text-stone hover:text-charcoal hover:bg-muted'}`}
            >
              {isPreview ? 'Edit' : 'Preview'}
            </button>
            <span className="w-px h-4 bg-border-subtle mx-1 shrink-0" />
            
            {/* Headings Dropdown */}
            <div className="relative shrink-0 group/heading">
              <button className={`flex items-center gap-0.5 px-1.5 py-1.5 rounded-md text-[11px] transition-colors ${editor?.isActive('heading') ? 'bg-charcoal text-white' : 'text-stone hover:text-charcoal hover:bg-muted'}`}>
                {editor?.isActive('heading', { level: 1 }) ? 'Heading 1' : 
                 editor?.isActive('heading', { level: 2 }) ? 'Heading 2' : 
                 editor?.isActive('heading', { level: 3 }) ? 'Heading 3' : 'Normal'} 
                <ChevronDown className="w-3 h-3" />
              </button>
              <div className="hidden group-hover/heading:flex absolute left-0 top-full z-30 w-28 bg-white border border-border-subtle rounded-lg shadow-lg py-1 flex-col">
                <button onClick={() => editor?.chain().focus().setParagraph().run()} className={`px-3 py-1.5 text-[12px] text-left transition-colors ${editor?.isActive('paragraph') ? 'bg-muted text-charcoal font-semibold' : 'text-charcoal hover:bg-muted'}`}>Normal</button>
                <button onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className={`px-3 py-1.5 text-[13px] text-left transition-colors ${editor?.isActive('heading', { level: 1 }) ? 'bg-muted text-charcoal font-bold' : 'font-semibold text-charcoal hover:bg-muted'}`}>Heading 1</button>
                <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={`px-3 py-1.5 text-[12.5px] text-left transition-colors ${editor?.isActive('heading', { level: 2 }) ? 'bg-muted text-charcoal font-bold' : 'font-semibold text-charcoal hover:bg-muted'}`}>Heading 2</button>
                <button onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className={`px-3 py-1.5 text-[12px] text-left transition-colors ${editor?.isActive('heading', { level: 3 }) ? 'bg-muted text-charcoal font-bold' : 'font-semibold text-charcoal hover:bg-muted'}`}>Heading 3</button>
              </div>
            </div>
            <span className="w-px h-4 bg-border-subtle mx-1 shrink-0" />
            
            {/* Bold & Italic */}
            <button onClick={() => editor?.chain().focus().toggleBold().run()} className={`p-1.5 rounded-md transition-colors shrink-0 ${editor?.isActive('bold') ? 'bg-charcoal text-white' : 'text-stone hover:text-charcoal hover:bg-muted'}`} aria-label="Bold">
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={`p-1.5 rounded-md transition-colors shrink-0 ${editor?.isActive('italic') ? 'bg-charcoal text-white' : 'text-stone hover:text-charcoal hover:bg-muted'}`} aria-label="Italic">
              <Italic className="w-3.5 h-3.5" />
            </button>
            
            {/* Links & Code */}
            <button 
              onClick={() => {
                const previousUrl = editor?.getAttributes('link').href;
                const url = window.prompt('Enter URL', previousUrl);
                if (url === null) return; 
                if (url === '') {
                  editor?.chain().focus().extendMarkRange('link').unsetLink().run();
                  return;
                }
                editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
              }} 
              className={`p-1.5 rounded-md transition-colors shrink-0 ${editor?.isActive('link') ? 'bg-charcoal text-white' : 'text-stone hover:text-charcoal hover:bg-muted'}`}
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => editor?.chain().focus().toggleCode().run()} className={`p-1.5 rounded-md transition-colors shrink-0 ${editor?.isActive('code') ? 'bg-charcoal text-white' : 'text-stone hover:text-charcoal hover:bg-muted'}`}>
              <Code className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => editor?.chain().focus().toggleCodeBlock().run()} className={`p-1.5 rounded-md transition-colors shrink-0 ${editor?.isActive('codeBlock') ? 'bg-charcoal text-white' : 'text-stone hover:text-charcoal hover:bg-muted'}`}>
              <Code2 className="w-3.5 h-3.5" />
            </button>
            <span className="w-px h-4 bg-border-subtle mx-1 shrink-0" />
            
            {/* Lists & Quotes */}
            <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded-md transition-colors shrink-0 ${editor?.isActive('bulletList') ? 'bg-charcoal text-white' : 'text-stone hover:text-charcoal hover:bg-muted'}`} aria-label="Bullet list">
              <List className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={`p-1.5 rounded-md transition-colors shrink-0 ${editor?.isActive('orderedList') ? 'bg-charcoal text-white' : 'text-stone hover:text-charcoal hover:bg-muted'}`}>
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => editor?.chain().focus().toggleBlockquote().run()} className={`p-1.5 rounded-md transition-colors shrink-0 ${editor?.isActive('blockquote') ? 'bg-charcoal text-white' : 'text-stone hover:text-charcoal hover:bg-muted'}`}>
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => editor?.chain().focus().setHorizontalRule().run()} className="p-1.5 rounded-md text-stone hover:text-charcoal hover:bg-muted transition-colors shrink-0">
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-px h-4 bg-border-subtle mx-1 shrink-0" />
            
            {/* Clear Formatting */}
            <button onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()} className="p-1.5 rounded-md text-stone hover:text-charcoal hover:bg-muted transition-colors shrink-0">
              <Eraser className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {activeNote.fromChat || isPreview ? (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="prose prose-sm max-w-none text-charcoal prose-p:leading-relaxed prose-a:text-oxblood">
            <ReactMarkdown components={activeNote.citations ? citedMarkdownComponents(activeNote.citations) : undefined}>
              {activeNote.content || '*No content yet...*'}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="flex-1 relative min-h-0 overflow-y-auto">
          {/* We swapped <textarea> for TipTap's EditorContent */}
          <EditorContent editor={editor} className="min-h-full" />
          
          <div className="absolute bottom-2 right-3 text-[11px] text-stone select-none pointer-events-none bg-white/80 px-1 rounded">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-3 border-t border-border-subtle bg-ivory shrink-0 gap-2">
        {activeNote.fromChat ? (
          <span className="flex items-center gap-1.5 text-[11px] text-stone">
            <Lock className="w-3.5 h-3.5 shrink-0" /> Saved responses are view only
          </span>
        ) : (
          <span className="text-[11px]">
            {isSaving ? (
              <span className="flex items-center gap-1.5 text-stone"><Loader2 className="w-3 h-3 animate-spin" /> Saving…</span>
            ) : isDirty ? (
              <span className="flex items-center gap-1.5 text-stone"><span className="w-1.5 h-1.5 rounded-full bg-oxblood inline-block" /> Unsaved</span>
            ) : (
              <span className="flex items-center gap-1.5 text-stone"><CheckCircle2 className="w-3.5 h-3.5" /> Saved</span>
            )}
          </span>
        )}
        <button
          onClick={() => onPushToast('success', 'Converted to source (coming soon).')}
          className="text-[12px] font-medium text-charcoal border border-border-strong rounded-md px-2.5 py-1.5 hover:bg-muted transition-colors shrink-0"
        >
          Convert to source
        </button>
      </div>
    </>
  );
}