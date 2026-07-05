"use client";

import { useState, useEffect } from 'react';
import { Sidebar } from '../components/workspace/Sidebar';
import { ChatPanel } from '../components/workspace/ChatPanel';

export default function Workspace() {
  const [sources, setSources] = useState<{name: string, status: 'loading' | 'ready' | 'error'}[]>([]);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const BACKEND_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    const fetchExistingDocuments = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/documents`);
        if (res.ok) {
          const data = await res.json();
          setSources(data);
        }
      } catch (err) {
        console.error("Failed to fetch documents", err);
      }
    };
    fetchExistingDocuments();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    const newSourceIndex = sources.length;
    setSources(prev => [...prev, { name: selectedFile.name, status: 'loading' }]);
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/upload`, { method: 'POST', body: formData });
      setSources(prev => {
        const newSources = [...prev];
        newSources[newSourceIndex].status = res.ok ? 'ready' : 'error';
        return newSources;
      });
    } catch (err) {
      // FIX: Used the 'err' variable by logging it
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
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsSearching(true);
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer || data.response }]);
    } catch (err) {
      // FIX: Used the 'err' variable by logging it
      console.error("Search failed", err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'System Error: Could not reach the archives.' }]);
    }
    setIsSearching(false);
  };

  return (
    <div className="flex h-screen bg-paper text-charcoal font-sans overflow-hidden selection:bg-muted">
      <Sidebar 
        isOpen={isSidebarOpen}
        sources={sources}
        isUploading={isUploading}
        onFileSelect={handleFileSelect}
      />
      <ChatPanel 
        messages={messages}
        isSearching={isSearching}
        onSearch={handleSearch}
        onClear={() => setMessages([])}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
    </div>
  );
}