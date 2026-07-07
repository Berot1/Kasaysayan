import { useState, useRef, useEffect } from 'react';
import { BookOpen, User, Loader2, Send, MoreVertical, Trash2, PenLine, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { citedMarkdownComponents } from './CitationChip';
import { Citation } from './types';

interface ChatPanelProps {
  messages: { role: 'user' | 'assistant'; content: string; citations?: Citation[] }[];
  isSearching: boolean;
  chatInput: string;
  setChatInput: (v: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onClearConversation: () => void;
  onSaveResponseToNote: (content: string, citations?: Citation[]) => void;
  sourcesCount: number;
  onPushToast: (type: 'success' | 'error', msg: string) => void; // ✅ added
}

export function ChatPanel({
  messages,
  isSearching,
  chatInput,
  setChatInput,
  onSendMessage,
  onClearConversation,
  onSaveResponseToNote,
  sourcesCount,
  onPushToast,
}: ChatPanelProps) {
  const [chatMenuOpen, setChatMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSearching]);

  return (
    <div className="flex-1 flex flex-col bg-white rounded-2xl border border-border-subtle shadow-sm min-w-0 overflow-hidden">
      <div className="h-12 border-b border-border-subtle flex items-center justify-between px-4 shrink-0">
        <h2 className="text-[14px] font-medium text-charcoal">Chat</h2>
        <div className="relative">
          <button onClick={() => setChatMenuOpen(o => !o)} className="p-1.5 rounded-md hover:bg-muted text-stone hover:text-charcoal transition-colors" aria-label="Chat options">
            <MoreVertical className="w-4 h-4" />
          </button>
          {chatMenuOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setChatMenuOpen(false)} />
              <div className="absolute right-0 top-9 z-30 w-48 bg-white border border-border-subtle rounded-lg shadow-lg py-1">
                <button
                  onClick={() => { onClearConversation(); setChatMenuOpen(false); }}
                  disabled={messages.length === 0}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-charcoal hover:bg-muted transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear conversation
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
            <div className="w-12 h-12 bg-oxblood-muted rounded-xl flex items-center justify-center mx-auto mb-4 border border-border-subtle">
              <BookOpen className="w-6 h-6 text-oxblood" />
            </div>
            <h3 className="font-display text-lg font-medium mb-2 text-charcoal">Consult the intelligence engine</h3>
            <p className="text-sm text-stone mb-6">
              {sourcesCount === 0
                ? 'Add a source on the left to begin. Kasaysayan will analyze it and provide cited answers.'
                : 'Ask questions about your uploaded sources. Kasaysayan will analyze them and provide cited answers.'}
            </p>
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={() => setChatInput("Summarize the main arguments of the uploaded documents.")}
                disabled={sourcesCount === 0}
                className="text-xs p-3 rounded-lg border border-border-subtle hover:bg-surface text-stone hover:text-charcoal transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
              >
                Summarize documents
              </button>
              <button
                onClick={() => setChatInput("Identify any key historical figures mentioned.")}
                disabled={sourcesCount === 0}
                className="text-xs p-3 rounded-lg border border-border-subtle hover:bg-surface text-stone hover:text-charcoal transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
              >
                Identify key figures
              </button>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-oxblood-muted flex items-center justify-center shrink-0 mt-0.5 border border-border-subtle">
                  <BookOpen className="w-4 h-4 text-oxblood" />
                </div>
              )}
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-muted border border-border-subtle rounded-xl px-4 py-3' : ''}`}>
                <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'text-charcoal' : 'text-charcoal prose-p:leading-relaxed prose-a:text-oxblood'}`}>
                  {msg.role === 'user' ? (
                    <p className="m-0 text-[14px]">{msg.content}</p>
                  ) : (
                    <ReactMarkdown components={citedMarkdownComponents(msg.citations)}>{msg.content}</ReactMarkdown>
                  )}
                </div>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1 mt-2 -ml-1.5">
                    <button
                      onClick={() => onSaveResponseToNote(msg.content, msg.citations)}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11.5px] font-medium text-stone hover:text-charcoal hover:bg-muted transition-colors"
                    >
                      <PenLine className="w-3 h-3" /> Save to note
                    </button>
                    <button
                      onClick={() => { navigator.clipboard.writeText(msg.content); onPushToast('success', 'Copied to clipboard.'); }}
                      className="p-1.5 rounded-md text-stone hover:text-charcoal hover:bg-muted transition-colors"
                      aria-label="Copy response"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onPushToast('success', 'Thanks for your feedback!')}
                      className="p-1.5 rounded-md text-stone hover:text-charcoal hover:bg-muted transition-colors"
                      aria-label="Good response"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onPushToast('success', 'Thanks for your feedback!')}
                      className="p-1.5 rounded-md text-stone hover:text-charcoal hover:bg-muted transition-colors"
                      aria-label="Poor response"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-white border border-border-subtle flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-stone" />
                </div>
              )}
            </div>
          ))
        )}
        {isSearching && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-oxblood-muted flex items-center justify-center shrink-0 mt-0.5 border border-border-subtle">
              <Loader2 className="w-4 h-4 text-oxblood animate-spin" />
            </div>
            <div className="flex items-center text-stone h-9 text-[13px] italic">Consulting archives...</div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      <div className="border-t border-border-subtle p-3 shrink-0">
        <form onSubmit={onSendMessage} className="flex items-center gap-2 bg-surface border border-border-strong rounded-full pl-4 pr-2 py-2 focus-within:border-charcoal/30 transition-all">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={sourcesCount === 0 ? "Add a source to start asking questions..." : "Ask Kasaysayan..."}
            disabled={isSearching || sourcesCount === 0}
            className="flex-1 bg-transparent outline-none text-[14px] text-charcoal placeholder:text-stone disabled:opacity-50 min-w-0"
          />
          <span className="hidden sm:inline text-[12px] text-stone shrink-0 whitespace-nowrap">{sourcesCount} source{sourcesCount === 1 ? '' : 's'}</span>
          <button
            type="submit"
            disabled={isSearching || !chatInput.trim() || sourcesCount === 0}
            className="w-8 h-8 bg-charcoal hover:bg-black disabled:bg-border-subtle text-background rounded-full transition-colors flex items-center justify-center shrink-0"
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}