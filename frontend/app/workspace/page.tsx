"use client";

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, FileText, Loader2, Sparkles, User, FileUp, Database, Trash2, Plus, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function Workspace() {
  const [sources, setSources] = useState<{name: string, status: 'loading' | 'ready' | 'error'}[]>([]);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
        console.error("Failed to fetch documents from database", err);
      }
    };
    fetchExistingDocuments();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSearching]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const newSourceIndex = sources.length;
    setSources(prev => [...prev, { name: selectedFile.name, status: 'loading' }]);
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch(`${BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      
      setSources(prev => {
        const newSources = [...prev];
        newSources[newSourceIndex].status = res.ok ? 'ready' : 'error';
        return newSources;
      });
    } catch (err) {
      console.error(err);
      setSources(prev => {
        const newSources = [...prev];
        newSources[newSourceIndex].status = 'error';
        return newSources;
      });
    }
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = query;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setQuery('');
    setIsSearching(true);
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage }),
      });
      
      const data = await res.json();
      const aiAnswer = data.answer || data.response || JSON.stringify(data);
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiAnswer }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ System Error: Could not reach the intelligence engine.' }]);
    }
    setIsSearching(false);
  };

  return (
    <div className="flex h-screen bg-[#FDFDFD] text-[#11181C] font-sans overflow-hidden">
      
      {/* SIDEBAR: Knowledge Base */}
      <div className={`relative bg-[#F8F9FA] border-r border-[#EAEAEA] flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-[300px]' : 'w-0'}`}>
        
        {/* Content wrapper ensures content doesn't squeeze weirdly during animation */}
        <div className="w-[300px] h-full flex flex-col overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-[#EAEAEA]">
            <Link href="/" className="text-[14px] font-bold text-[#11181C] tracking-wide flex items-center gap-2 cursor-pointer hover:opacity-80">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Kasaysayan
            </Link>
          </div>
          
          <div className="px-5 pt-6 pb-2 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-[#687076] tracking-widest uppercase">Sources</h2>
            <div className="flex gap-2">
              <input type="file" className="hidden" accept=".pdf,image/*" ref={fileInputRef} onChange={handleFileSelect} />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-7 h-7 rounded-full bg-white border border-[#EAEAEA] hover:border-[#D7DBDF] hover:bg-[#F1F3F5] flex items-center justify-center transition-all shadow-sm disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="w-3.5 h-3.5 text-[#687076] animate-spin" /> : <Plus className="w-4 h-4 text-[#11181C]" />}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {sources.length === 0 ? (
              <div className="text-center mt-6 p-5 border border-dashed border-[#D7DBDF] rounded-2xl bg-white">
                <FileUp className="w-6 h-6 text-[#AEC0CE] mx-auto mb-2" />
                <p className="text-sm font-medium text-[#11181C]">No documents yet</p>
                <p className="text-xs text-[#687076] mt-1">Upload PDFs to ground the AI.</p>
              </div>
            ) : (
              sources.map((source, idx) => (
                <div key={idx} className="group flex items-center gap-3 p-3 bg-white rounded-xl border border-[#EAEAEA] shadow-sm hover:border-[#D7DBDF] transition-all cursor-default">
                  <div className={`p-1.5 rounded-lg ${source.status === 'ready' ? 'bg-[#E1F0FF] text-[#006FEE]' : 'bg-[#F1F3F5] text-[#687076]'}`}>
                    {source.status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#11181C] truncate">{source.name}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* OVERLAPPING TOGGLE BUTTON (From your UI Mockup) */}
      <div className="relative z-50">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`absolute top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-white border border-[#EAEAEA] shadow-[0_4px_14px_rgba(0,0,0,0.08)] rounded-xl transition-all duration-300 hover:bg-gray-50 focus:outline-none ${isSidebarOpen ? '-ml-5' : 'ml-4'}`}
        >
          <ChevronRight className={`w-5 h-5 text-gray-700 transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* MAIN CONTENT: Chat Interface */}
      <div className="flex-1 flex flex-col relative bg-white">
        
        <header className="h-16 flex items-center justify-end px-8">
          {messages.length > 0 && (
            <button onClick={() => setMessages([])} className="flex items-center gap-1.5 text-xs font-semibold text-[#687076] hover:text-[#E5484D] transition-colors px-3 py-2 rounded-lg hover:bg-[#FFE5E5]">
              <Trash2 className="w-4 h-4" /> Clear Chat
            </button>
          )}
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-16 lg:px-40 py-4 pb-36">
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto mt-20 text-center">
              <h2 className="text-3xl font-semibold text-[#11181C] mb-4">How can I help you research today?</h2>
              <p className="text-[#687076] mb-10 text-[16px]">
                Ask questions about your uploaded documents. I will analyze the texts and provide citations for my answers.
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-10">
              {messages.map((msg, index) => (
                <div key={index} className={`flex gap-5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-[#F1F3F5] rounded-3xl rounded-tr-sm px-6 py-4' : ''}`}>
                    <div className={`prose prose-sm md:prose-base max-w-none ${msg.role === 'user' ? 'text-[#11181C]' : 'text-[#3E4346] prose-p:leading-relaxed prose-headings:font-semibold prose-a:text-[#006FEE]'}`}>
                      {msg.role === 'user' ? (
                        <p className="m-0 text-[15px]">{msg.content}</p>
                      ) : (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      )}
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-[#EAEAEA] flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-[#687076]" />
                    </div>
                  )}
                </div>
              ))}
              
              {isSearching && (
                <div className="flex gap-5">
                   <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1 opacity-70">
                      <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2 text-[#687076]">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-[14px] font-medium">Scanning documents...</span>
                    </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Floating Input Area */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-12 pb-8 px-4 md:px-16 lg:px-40 pointer-events-none">
          <div className="max-w-3xl mx-auto relative pointer-events-auto">
            <form onSubmit={handleSearch} className="relative flex items-center gap-2 bg-[#F8F9FA] border border-[#EAEAEA] rounded-[2rem] p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <input 
                type="text" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder="Ask Kasaysayan..."
                className="flex-1 px-5 py-3.5 bg-transparent outline-none text-[#11181C] placeholder-[#87909F] text-[15px]"
                disabled={isSearching}
              />
              <button 
                type="submit" 
                disabled={isSearching || !query.trim()}
                className="w-11 h-11 bg-slate-900 hover:bg-black disabled:bg-[#EAEAEA] disabled:text-[#AEC0CE] text-white rounded-full transition-colors flex items-center justify-center flex-shrink-0"
              >
                {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}