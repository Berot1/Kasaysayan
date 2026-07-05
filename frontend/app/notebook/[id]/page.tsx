"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Share, 
  BookOpen, 
  PenLine, 
  MessageSquare, 
  MoreHorizontal, 
  Loader2 
} from 'lucide-react';

const BACKEND_URL = 'http://127.0.0.1:8000';

export default function NotebookPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const notebookId = resolvedParams.id;

  const [activeTab, setActiveTab] = useState<'notes' | 'ai'>('notes');
  const [noteContent, setNoteContent] = useState('');
  const [title, setTitle] = useState('Loading...');
  
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchNotebook = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
        return;
      }
      setSession(session);
      
      try {
        const res = await fetch(`${BACKEND_URL}/api/notebooks/${notebookId}`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setTitle(data.title);
          setNoteContent(data.content || '');
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error("Failed to load notebook:", error);
      }
      setIsLoading(false);
    };
    fetchNotebook();
  }, [notebookId, router]);

  const handleSave = async () => {
    if (!session) return;
    setIsSaving(true);
    try {
      await fetch(`${BACKEND_URL}/api/notebooks/${notebookId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}` 
        },
        body: JSON.stringify({ title, content: noteContent })
      });
    } catch (error) {
      console.error("Failed to save:", error);
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center bg-paper text-charcoal"><Loader2 className="animate-spin w-8 h-8" /></div>;
  }

  return (
    <div className="flex flex-col h-screen bg-paper text-charcoal font-sans selection:bg-muted">
      
      {/* Editorial Navigation Bar */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-border-subtle bg-ivory shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 -ml-2 text-stone hover:text-charcoal hover:bg-surface rounded-md transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-px h-4 bg-border-strong"></div>
          <div>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-medium text-[15px] bg-transparent outline-none focus:border-b focus:border-charcoal/30 w-64"
            />
            <p className="text-[11px] font-mono text-stone mt-0.5">Notebook ID: {notebookId.split('-')[0]}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="text-stone hover:text-charcoal p-2 rounded-md transition-colors">
            <Share className="w-4 h-4" />
          </button>
          <button className="text-stone hover:text-charcoal p-2 rounded-md transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-charcoal hover:bg-black disabled:bg-stone text-background px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
        </div>
      </header>

      {/* Main Split Workspace */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANE: The Archival Source Viewer */}
        <section className="w-1/2 border-r border-border-subtle flex flex-col bg-surface relative">
          <div className="h-12 border-b border-border-subtle flex items-center px-4 bg-ivory shrink-0">
            <div className="flex items-center gap-2 text-xs font-mono text-stone uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              Source Document
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 md:p-12">
            <article className="max-w-2xl mx-auto prose prose-stone prose-p:leading-relaxed prose-headings:font-display">
              <h2 className="text-2xl font-medium mb-6">Issue No. 1 - February 15, 1889</h2>
              <p>
                Our aspirations are modest, very modest. Our program, aside from being harmless, is very simple: to fight all reaction, to hinder all steps backward, to applaud and accept every liberal idea, to defend all progress; in a word: to be a propagandist, above all, of ideals of democracy so that they might become a reality in all the nations that make up the Spanish empire.
              </p>
              <p>
                ...If it is true that the colonies are part of the Spanish nation, then they ought to be treated as such, and not as exploited lands, nor as fiefs of the friars.
              </p>
            </article>
          </div>
        </section>

        {/* RIGHT PANE: Researcher Tools (Notes & AI) */}
        <section className="w-1/2 flex flex-col bg-ivory ml-auto">
          
          {/* Tab Navigation */}
          <div className="h-12 border-b border-border-subtle flex items-center px-2 shrink-0 bg-surface">
            <button 
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 px-4 h-full text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'notes' 
                  ? 'border-oxblood text-oxblood' 
                  : 'border-transparent text-stone hover:text-charcoal hover:bg-muted/50'
              }`}
            >
              <PenLine className="w-4 h-4" />
              My Notes
            </button>
            <button 
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-4 h-full text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'ai' 
                  ? 'border-oxblood text-oxblood' 
                  : 'border-transparent text-stone hover:text-charcoal hover:bg-muted/50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Kasaysayan AI
            </button>
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {activeTab === 'notes' ? (
              <textarea 
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Start typing your research notes here. Connect ideas, summarize arguments, or draft your thesis..."
                className="flex-1 w-full p-8 resize-none bg-transparent outline-none text-[15px] leading-relaxed text-charcoal placeholder:text-muted focus:ring-0"
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div className="max-w-sm">
                  <div className="w-12 h-12 bg-oxblood-muted rounded-xl flex items-center justify-center mx-auto mb-4 border border-border-subtle">
                    <BookOpen className="w-6 h-6 text-oxblood" />
                  </div>
                  <h3 className="font-display text-lg font-medium mb-2">Consult the Intelligence Engine</h3>
                  <p className="text-sm text-stone mb-6">
                    Highlight text from the source document on the left, or type a question here to analyze this specific archive.
                  </p>
                  <button className="text-sm font-medium text-charcoal border border-border-strong hover:border-charcoal hover:bg-surface px-4 py-2 rounded-md transition-colors">
                    Ask a question
                  </button>
                </div>
              </div>
            )}
          </div>

        </section>
      </main>
    </div>
  );
}