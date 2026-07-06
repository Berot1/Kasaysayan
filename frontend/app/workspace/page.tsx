"use client";

import { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Sidebar } from '../components/workspace/Sidebar';
import { ChatPanel } from '../components/workspace/ChatPanel';
import { Loader2 } from 'lucide-react';

export default function Workspace() {
  const [sources, setSources] = useState<{name: string, status: 'loading' | 'ready' | 'error'}[]>([]);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Auth state
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const router = useRouter();
  
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

  const fetchExistingDocuments = async (token: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/documents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSources(data);
      }
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
      } else {
        setSession(session);
        fetchExistingDocuments(session.access_token);
      }
      setIsLoadingAuth(false);
    };
    checkAuth();
  }, [router]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || !session) return;
    
    const newSourceIndex = sources.length;
    setSources(prev => [...prev, { name: selectedFile.name, status: 'loading' }]);
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/upload`, { 
        method: 'POST', 
        headers: { 'Authorization': `Bearer ${session.access_token}` }, // Send JWT
        body: formData 
      });
      setSources(prev => {
        const newSources = [...prev];
        newSources[newSourceIndex].status = res.ok ? 'ready' : 'error';
        return newSources;
      });
    } catch (err) {
      console.error("Failed to upload document", err);
      setSources(prev => {
        const newSources = [...prev];
        newSources[newSourceIndex].status = 'error';
        return newSources;
      });
    }
    setIsUploading(false);
  };

  const handleSearch = async (userMessage: string) => {
    if (!session) return;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsSearching(true);
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/search`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}` // Send JWT
        },
        body: JSON.stringify({ query: userMessage }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer || data.response }]);
    } catch (err) {
      console.error("Search failed", err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'System Error: Could not reach the archives.' }]);
    }
    setIsSearching(false);
  };

  if (isLoadingAuth) {
    return <div className="h-screen w-full flex items-center justify-center bg-paper text-charcoal"><Loader2 className="animate-spin w-8 h-8" /></div>;
  }

  return (
    <div className="flex h-screen bg-paper text-charcoal font-sans overflow-hidden selection:bg-muted">
      {/* Existing Sidebar and ChatPanel components go here... */}
      <Sidebar isOpen={isSidebarOpen} sources={sources} isUploading={isUploading} onFileSelect={handleFileSelect} />
      <ChatPanel messages={messages} isSearching={isSearching} onSearch={handleSearch} onClear={() => setMessages([])} isSidebarOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
    </div>
  );
}