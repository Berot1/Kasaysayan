import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Loader2, BookOpen, User, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface ChatPanelProps {
  messages: { role: 'user' | 'assistant', content: string }[];
  isSearching: boolean;
  onSearch: (query: string) => void;
  onClear: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function ChatPanel({ messages, isSearching, onSearch, onClear, isSidebarOpen, onToggleSidebar }: ChatPanelProps) {
  const [query, setQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSearching]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query);
    setQuery('');
  };

  return (
    <div className="flex-1 flex flex-col relative bg-white">
      
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-[#E6E2D8] bg-white z-10">
        <button 
          onClick={onToggleSidebar}
          className="p-1.5 text-[#6B6862] hover:bg-[#F1EFE9] hover:text-[#201F1C] rounded-md transition-colors"
        >
          {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
        </button>
        
        {messages.length > 0 && (
          <button onClick={onClear} className="text-sm font-medium text-[#201F1C] border border-[#E6E2D8] hover:bg-[#F1EFE9] transition-colors px-4 py-2 rounded-md">
            Clear Canvas
          </button>
        )}
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 lg:px-32 py-10 pb-40">
        {messages.length === 0 ? (
          <div className="max-w-xl mx-auto mt-16">
            <div className="inline-flex items-center gap-2 mb-6 text-[11px] font-mono uppercase tracking-[0.12em] text-[#8C2F2F] bg-[#F6EAE6] px-3 py-1.5 rounded-full">
              <BookOpen className="w-3.5 h-3.5" />
              Intelligence Engine
            </div>
            <h1 className="font-display text-4xl font-medium text-[#201F1C] mb-4">Research Assistant</h1>
            <p className="text-[#6B6862] leading-relaxed mb-8 text-[16px]">
              Ask questions about your uploaded archival documents. Kasaysayan will analyze the texts and provide fully cited, historically grounded answers.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["Summarize the latest document", "Identify key historical figures", "Compare perspectives in the texts"].map(prompt => (
                <button key={prompt} onClick={() => setQuery(prompt)} className="text-left p-4 rounded-xl border border-[#E6E2D8] bg-white hover:border-[#201F1C]/30 hover:shadow-sm transition-all text-sm text-[#6B6862] hover:text-[#201F1C]">
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-10">
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                
                {/* Assistant Icon matches landing page styling */}
                {msg.role === 'assistant' && (
                  <div className="w-9 h-9 rounded-lg bg-[#F6EAE6] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#EFEDE6]">
                    <BookOpen className="w-4 h-4 text-[#8C2F2F]" />
                  </div>
                )}
                
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-[#F1EFE9] border border-[#E6E2D8] rounded-xl px-5 py-4' : ''}`}>
                  <div className={`prose prose-sm md:prose-base max-w-none ${msg.role === 'user' ? 'text-[#201F1C]' : 'text-[#2A2926] prose-p:leading-relaxed prose-headings:font-display prose-headings:font-medium prose-a:text-[#8C2F2F] prose-a:underline-offset-4'}`}>
                    {msg.role === 'user' ? (
                      <p className="m-0 text-[15px]">{msg.content}</p>
                    ) : (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    )}
                  </div>
                </div>

                {/* User Icon matches landing page styling */}
                {msg.role === 'user' && (
                  <div className="w-9 h-9 rounded-lg bg-white border border-[#E6E2D8] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-[#6B6862]" />
                  </div>
                )}
              </div>
            ))}
            
            {isSearching && (
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-lg bg-[#F6EAE6] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#EFEDE6]">
                  <Loader2 className="w-4 h-4 text-[#8C2F2F] animate-spin" />
                </div>
                <div className="flex items-center text-[#6B6862] h-10">
                  <span className="text-[14px] italic">Consulting archives...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Minimalist Input Panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-12 pb-8 px-6 md:px-12 lg:px-32 pointer-events-none">
        <div className="max-w-3xl mx-auto relative pointer-events-auto">
          <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-white border border-[#E6E2D8] rounded-xl p-2 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] focus-within:border-[#201F1C]/30 focus-within:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] transition-all">
            <textarea 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
              placeholder="Ask Kasaysayan..."
              className="flex-1 max-h-32 min-h-[44px] px-3 py-2.5 bg-transparent outline-none text-[#201F1C] placeholder-[#9C988E] text-[15px] resize-none"
              disabled={isSearching}
              rows={1}
            />
            {/* Dark button exactly like the landing page 'Try Kasaysayan' */}
            <button 
              type="submit"
              disabled={isSearching || !query.trim()}
              className="w-10 h-10 mb-0.5 mr-0.5 bg-[#201F1C] hover:bg-black disabled:bg-[#E6E2D8] disabled:text-[#9C988E] text-[#FAF8F4] rounded-lg transition-colors flex items-center justify-center flex-shrink-0"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
          <div className="text-center mt-4">
            <span className="text-[11px] font-mono text-[#9C988E] uppercase tracking-wider">AI can make mistakes. Verify citations.</span>
          </div>
        </div>
      </div>
    </div>
  );
}