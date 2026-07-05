import { useRef } from 'react';
import Link from 'next/link';
import { Plus, Loader2, History, Library, Landmark } from 'lucide-react';
import { DocumentCard } from '../ui/DocumentCard';

interface SidebarProps {
  isOpen: boolean;
  sources: { name: string; status: 'loading' | 'ready' | 'error' }[];
  isUploading: boolean;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Sidebar({ isOpen, sources, isUploading, onFileSelect }: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileSelect(e);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; 
    }
  };

  return (
    <div className={`relative bg-[#FAF8F4] border-r border-[#E6E2D8] flex flex-col flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'w-[280px]' : 'w-0'}`}>
      <div className="w-[280px] h-full flex flex-col">
        
        {/* Header matched to Landing Page Navbar */}
        <div className="h-16 px-6 flex items-center border-b border-[#E6E2D8]">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-md bg-[#8C2F2F] flex items-center justify-center">
              <Landmark className="w-4 h-4 text-[#FAF8F4]" />
            </div>
            <span className="font-semibold text-[15px] text-[#201F1C] tracking-tight">Kasaysayan</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          <div>
            <p className="px-2 mb-3 text-[11px] font-mono text-[#9C988E] uppercase tracking-[0.12em]">Workspace</p>
            <div className="space-y-0.5">
              {/* Active state styling uses the Red/Pink accent from landing page */}
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md bg-[#F6EAE6] text-[#8C2F2F] font-medium transition-colors">
                <History className="w-4 h-4" /> Current Session
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md text-[#6B6862] hover:bg-[#E6E2D8]/30 hover:text-[#201F1C] transition-colors">
                <Library className="w-4 h-4" /> Saved Insights
              </button>
            </div>
          </div>

          <div>
            <div className="px-2 mb-3 flex items-center justify-between">
              <p className="text-[11px] font-mono text-[#9C988E] uppercase tracking-[0.12em]">Sources</p>
              <input type="file" className="hidden" accept=".pdf,image/*" ref={fileInputRef} onChange={handleFileChange} />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-6 h-6 rounded flex items-center justify-center text-[#6B6862] hover:bg-[#E6E2D8] hover:text-[#201F1C] transition-colors disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="space-y-2">
              {sources.length === 0 ? (
                <div className="text-center py-6 px-4 border border-dashed border-[#D8D4C8] rounded-xl bg-[#FAF8F4]">
                  <p className="text-sm text-[#6B6862] mb-1">No sources added.</p>
                  <button onClick={() => fileInputRef.current?.click()} className="text-[13px] font-medium text-[#8C2F2F] border-b border-[#8C2F2F]/30 hover:border-[#8C2F2F]">
                    Upload document
                  </button>
                </div>
              ) : (
                sources.map((source, idx) => (
                  <DocumentCard key={idx} name={source.name} status={source.status} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}