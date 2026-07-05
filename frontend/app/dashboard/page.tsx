"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, Settings, Landmark, User, Plus, Loader2, LogOut, 
  LayoutGrid, List, ChevronDown, MoreVertical, Trash2, Edit2, Pin, Globe
} from 'lucide-react';
import { ArchiveCard } from '../components/ui/ArchiveCard';

const BACKEND_URL = 'https://kasaysayan.onrender.com';

interface Notebook {
  id: string;
  title: string;
  updated_at: string;
  created_at: string;
  sourceCount?: number;
}

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data States
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  
  // UI Controls States
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'title'>('recent');
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'featured'>('all');
  
  const router = useRouter();

  // List View Dropdown State management
  const [openListDropdownId, setOpenListDropdownId] = useState<string | null>(null);
  const listDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (listDropdownRef.current && !listDropdownRef.current.contains(event.target as Node)) {
        setOpenListDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle actions for both Grid (ArchiveCard) and List views
  const handleCardAction = async (action: 'delete' | 'edit' | 'pin', id: string, currentTitle: string) => {
    setOpenListDropdownId(null); // Close list dropdown if open
    
    if (action === 'delete') {
      const confirmDelete = window.confirm(`Are you sure you want to delete "${currentTitle}"?`);
      if (confirmDelete) {
        // Optimistically remove from UI
        setNotebooks(notebooks.filter(nb => nb.id !== id));
        // TODO: Call backend to actually delete from database
        console.log(`Deleted ${id}`);
      }
    } else if (action === 'edit') {
      const newTitle = window.prompt("Enter new title:", currentTitle);
      if (newTitle && newTitle !== currentTitle) {
        // Optimistically update UI
        setNotebooks(notebooks.map(nb => nb.id === id ? { ...nb, title: newTitle } : nb));
        // TODO: Call backend to actually save the new title
        console.log(`Renamed ${id} to ${newTitle}`);
      }
    } else if (action === 'pin') {
      console.log(`Pinned ${id}`);
      // TODO: Implement pinning logic
    }
  };

  const handleListAction = (e: React.MouseEvent, action: 'delete' | 'edit' | 'pin', id: string, currentTitle: string) => {
    e.preventDefault();
    e.stopPropagation();
    handleCardAction(action, id, currentTitle);
  };

  const fetchNotebooks = async (token: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/notebooks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Mock source count for now until backend supports it natively
        const dataWithMockSources = data.map((nb: Notebook) => ({
          ...nb,
          sourceCount: Math.floor(Math.random() * 10) + 1
        }));
        setNotebooks(dataWithMockSources);
      }
    } catch (err) {
      console.error("Failed to fetch notebooks", err);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
      } else {
        setSession(session);
        await fetchNotebooks(session.access_token);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleCreateNotebook = async () => {
    if (!session) return;
    setIsCreating(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/notebooks`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      if (res.ok) {
        const newNotebook = await res.json();
        router.push(`/notebook/${newNotebook.id}`);
      }
    } catch (err) {
      console.error(err);
      setIsCreating(false);
    }
  };

  // Search & Sort Functionality
  const filteredAndSortedNotebooks = [...notebooks]
    .filter(nb => nb.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center bg-[#FAF8F4] text-[#201F1C]"><Loader2 className="animate-spin w-8 h-8" /></div>;
  }

  const avatarUrl = session?.user.user_metadata?.avatar_url;
  const fullName = session?.user.user_metadata?.full_name || 'Researcher';

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#201F1C] font-sans selection:bg-[#F1E2B8]">
      
      {/* Navigation Header */}
      <header className="border-b border-[#E6E2D8] bg-[#FAF8F4]">
        <nav className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-md bg-[#8C2F2F] flex items-center justify-center">
              <Landmark className="w-4 h-4 text-[#FAF8F4]" />
            </div>
            <span className="font-semibold text-[15px] tracking-tight">Kasaysayan</span>
          </Link>

          <div className="flex items-center gap-5">
            <button className="flex items-center gap-2 text-sm text-[#6B6862] hover:text-[#201F1C] transition-colors">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>
            
            <div className="relative">
              <div 
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-8 h-8 rounded-full border border-[#E6E2D8] bg-white flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#201F1C] transition-colors"
              >
                {avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-3.5 h-3.5 text-[#6B6862]" />
                )}
              </div>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E6E2D8] rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#E6E2D8] mb-1">
                    <p className="text-sm font-medium text-[#201F1C] truncate">{fullName}</p>
                    <p className="text-xs text-[#6B6862] truncate">{session?.user.email}</p>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-[#8C2F2F] hover:bg-[#F6EAE6] flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-10">
        
        {/* Top Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
             <button 
               onClick={() => setActiveTab('all')}
               className={`px-4 py-2 text-[13px] font-medium rounded-full whitespace-nowrap transition-colors ${activeTab === 'all' ? 'bg-white border border-[#E6E2D8] shadow-sm text-[#201F1C]' : 'text-[#6B6862] hover:text-[#201F1C] hover:bg-[#E6E2D8]/30'}`}
             >
               All
             </button>
             <button 
               onClick={() => setActiveTab('my')}
               className={`px-4 py-2 text-[13px] font-medium rounded-full whitespace-nowrap transition-colors ${activeTab === 'my' ? 'bg-white border border-[#E6E2D8] shadow-sm text-[#201F1C]' : 'text-[#6B6862] hover:text-[#201F1C] hover:bg-[#E6E2D8]/30'}`}
             >
               My notebooks
             </button>
             <button 
               onClick={() => setActiveTab('featured')}
               className={`px-4 py-2 text-[13px] font-medium rounded-full whitespace-nowrap transition-colors ${activeTab === 'featured' ? 'bg-white border border-[#E6E2D8] shadow-sm text-[#201F1C]' : 'text-[#6B6862] hover:text-[#201F1C] hover:bg-[#E6E2D8]/30'}`}
             >
               Featured notebooks
             </button>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Search Input */}
            <div className="relative group">
              <Search className="w-4 h-4 text-[#9C988E] absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#201F1C] transition-colors" />
              <input 
                type="text" 
                placeholder="Search archives..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-56 pl-9 pr-4 py-2 text-sm bg-white border border-[#E6E2D8] rounded-full outline-none focus:border-[#201F1C]/40 focus:shadow-sm transition-all"
              />
            </div>

            {/* View Mode Toggles */}
            <div className="flex items-center bg-white border border-[#E6E2D8] rounded-full p-0.5 shrink-0">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-[#F1EFE9] text-[#201F1C]' : 'text-[#9C988E] hover:text-[#201F1C]'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-full transition-colors ${viewMode === 'list' ? 'bg-[#F1EFE9] text-[#201F1C]' : 'text-[#9C988E] hover:text-[#201F1C]'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative group flex items-center gap-2 text-sm text-[#201F1C] bg-white border border-[#E6E2D8] rounded-full px-4 py-2 shrink-0 cursor-pointer hover:bg-[#F1EFE9] transition-colors">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'title')}
                className="appearance-none bg-transparent border-none font-medium text-[#201F1C] focus:outline-none cursor-pointer pr-4 w-full"
              >
                <option value="recent">Most recent</option>
                <option value="title">Title (A-Z)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B6862]" />
            </div>
            
            <button 
              onClick={handleCreateNotebook}
              disabled={isCreating}
              className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-black disabled:bg-[#6B6862] text-white px-5 py-2.5 rounded-full text-[13px] font-medium transition-colors shrink-0"
            >
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Create new
            </button>
          </div>
        </div>

        {/* --- 1. FEATURED NOTEBOOKS SECTION --- */}
        {(activeTab === 'all' || activeTab === 'featured') && !searchQuery && (
          <section className="mb-16">
            <h2 className="text-[22px] text-[#201F1C] mb-6">
              Featured notebooks
            </h2>
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <Link href="#" className="bg-white border border-[#E6E2D8] rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="relative h-28 bg-[#F1EFE9] flex items-center justify-center overflow-hidden">
                    <Image src="https://commons.wikimedia.org/wiki/Special:FilePath/Jose_Rizal_full.jpg?width=400" alt="Rizal" fill className="object-cover opacity-90 mix-blend-multiply" unoptimized />
                  </div>
                  <div className="p-4">
                    <span className="font-mono text-[10px] text-[#9C988E] uppercase tracking-wider mb-1 block">Literature</span>
                    <p className="text-[15px] font-medium text-[#201F1C]">Noli Me Tangere</p>
                    <p className="text-[11px] font-mono text-[#6B6862] mt-2 border-t border-[#EFEDE6] pt-2">Jul 5, 2026 • 12 sources</p>
                  </div>
                </Link>
                <Link href="#" className="bg-white border border-[#E6E2D8] rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="relative h-28 bg-[#F6EAE6] flex items-center justify-center overflow-hidden">
                    <Image src="https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Katipunan.svg?width=400" alt="Katipunan" fill className="object-cover opacity-80 mix-blend-multiply" unoptimized />
                  </div>
                  <div className="p-4">
                    <span className="font-mono text-[10px] text-[#9C988E] uppercase tracking-wider mb-1 block">Revolution</span>
                    <p className="text-[15px] font-medium text-[#201F1C]">Katipunan Records</p>
                    <p className="text-[11px] font-mono text-[#6B6862] mt-2 border-t border-[#EFEDE6] pt-2">Jun 12, 2026 • 8 sources</p>
                  </div>
                </Link>
                <Link href="#" className="bg-white border border-[#E6E2D8] rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="relative h-28 bg-[#F1EFE9] flex items-center justify-center overflow-hidden">
                    <Image src="https://commons.wikimedia.org/wiki/Special:FilePath/Carta%20Hydrographica%20y%20Chorographica%20de%20la%20Yslas%20Filipinas%20MANILA%2C%201734.jpg?width=400" alt="Map" fill className="object-cover opacity-90 mix-blend-multiply" unoptimized />
                  </div>
                  <div className="p-4">
                    <span className="font-mono text-[10px] text-[#9C988E] uppercase tracking-wider mb-1 block">Geography</span>
                    <p className="text-[15px] font-medium text-[#201F1C]">Murillo Velarde Map</p>
                    <p className="text-[11px] font-mono text-[#6B6862] mt-2 border-t border-[#EFEDE6] pt-2">May 20, 2026 • 3 sources</p>
                  </div>
                </Link>
              </div>
            ) : (
              // FEATURED LIST VIEW
              <div className="w-full">
                <div className="grid grid-cols-12 gap-4 pb-3 border-b border-[#E6E2D8] text-[13px] font-medium text-[#201F1C] px-2">
                  <div className="col-span-5">Title</div>
                  <div className="col-span-2">Sources</div>
                  <div className="col-span-2">Created</div>
                  <div className="col-span-2">Role</div>
                  <div className="col-span-1"></div>
                </div>
                
                <div className="flex flex-col">
                  <div className="group relative grid grid-cols-12 gap-4 py-4 border-b border-[#EFEDE6] hover:bg-[#F1EFE9]/50 transition-colors px-2 items-center cursor-pointer">
                    <div className="col-span-5 flex items-center gap-3">
                      <div className="w-6 h-6 shrink-0 bg-[#F1EFE9] rounded flex items-center justify-center overflow-hidden">
                        <Image src="https://commons.wikimedia.org/wiki/Special:FilePath/Jose_Rizal_full.jpg?width=100" alt="Rizal" width={24} height={24} className="object-cover opacity-80 mix-blend-multiply" unoptimized />
                      </div>
                      <span className="font-medium text-[14px] text-[#201F1C] truncate group-hover:text-[#8C2F2F] transition-colors">Noli Me Tangere</span>
                    </div>
                    <div className="col-span-2 text-[13px] text-[#6B6862]">12 Sources</div>
                    <div className="col-span-2 text-[13px] text-[#6B6862]">Jul 5, 2026</div>
                    <div className="col-span-2 text-[13px] text-[#6B6862] flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5" /> Reader
                    </div>
                    <div className="col-span-1"></div>
                  </div>

                  <div className="group relative grid grid-cols-12 gap-4 py-4 border-b border-[#EFEDE6] hover:bg-[#F1EFE9]/50 transition-colors px-2 items-center cursor-pointer">
                    <div className="col-span-5 flex items-center gap-3">
                      <div className="w-6 h-6 shrink-0 bg-[#F6EAE6] rounded flex items-center justify-center overflow-hidden">
                        <Image src="https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Katipunan.svg?width=100" alt="Katipunan" width={24} height={24} className="object-cover opacity-80 mix-blend-multiply" unoptimized />
                      </div>
                      <span className="font-medium text-[14px] text-[#201F1C] truncate group-hover:text-[#8C2F2F] transition-colors">Katipunan Records</span>
                    </div>
                    <div className="col-span-2 text-[13px] text-[#6B6862]">8 Sources</div>
                    <div className="col-span-2 text-[13px] text-[#6B6862]">Jun 12, 2026</div>
                    <div className="col-span-2 text-[13px] text-[#6B6862] flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5" /> Reader
                    </div>
                    <div className="col-span-1"></div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* --- 2. RECENT NOTEBOOKS SECTION --- */}
        {(activeTab === 'all' || activeTab === 'my') && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] text-[#201F1C]">
                Recent notebooks
              </h2>
              {searchQuery && (
                <span className="text-sm font-medium text-[#8C2F2F] bg-[#F6EAE6] px-3 py-1 rounded-full">
                  {searchQuery && (
                    <span className="text-sm font-medium text-[#8C2F2F] bg-[#F6EAE6] px-3 py-1 rounded-full">
                      {filteredAndSortedNotebooks.length} results for &quot;{searchQuery}&quot;
                    </span>
                  )}
                </span>
              )}
            </div>

            {filteredAndSortedNotebooks.length === 0 ? (
              <div className="w-full py-16 flex flex-col items-center justify-center border border-dashed border-[#D8D4C8] rounded-xl bg-white/50">
                <p className="text-[#6B6862] mb-4 text-sm">
                  {searchQuery ? "No archives match your search." : "You haven't created any archives yet."}
                </p>
                {!searchQuery && (
                  <button 
                    onClick={handleCreateNotebook}
                    className="text-sm font-medium text-[#8C2F2F] hover:underline underline-offset-4"
                  >
                    Create your first archive
                  </button>
                )}
              </div>
            ) : (
              <div className={`gap-5 ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'flex flex-col'}`}>
                
                {/* Only show the 'Create' card in grid view when not searching */}
                {viewMode === 'grid' && !searchQuery && (
                  <div onClick={handleCreateNotebook} className="cursor-pointer">
                    <ArchiveCard isCreate href="#" />
                  </div>
                )}

                {viewMode === 'grid' ? (
                    filteredAndSortedNotebooks.map(notebook => (
                      <ArchiveCard 
                        key={notebook.id}
                        id={notebook.id}
                        title={notebook.title} 
                        date={formatDate(notebook.updated_at)} 
                        sourceCount={notebook.sourceCount} 
                        href={`/notebook/${notebook.id}`}
                        onAction={handleCardAction}
                      />
                    ))
                ) : (
                  // RECENT LIST VIEW
                  <div className="w-full">
                    <div className="grid grid-cols-12 gap-4 pb-3 border-b border-[#E6E2D8] text-[13px] font-medium text-[#201F1C] px-2">
                      <div className="col-span-5">Title</div>
                      <div className="col-span-2">Sources</div>
                      <div className="col-span-2">Created</div>
                      <div className="col-span-2">Role</div>
                      <div className="col-span-1"></div>
                    </div>
                    
                    <div className="flex flex-col">
                      {filteredAndSortedNotebooks.map(notebook => (
                        <div key={notebook.id} className="group relative grid grid-cols-12 gap-4 py-4 border-b border-[#EFEDE6] hover:bg-[#F1EFE9]/50 transition-colors px-2 items-center">
                          <div className="col-span-5 flex items-center gap-3">
                            <Link href={`/notebook/${notebook.id}`} className="flex items-center gap-3 w-full">
                            <div className="w-6 h-6 shrink-0 flex items-center justify-center text-[#8C2F2F]">
                              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <span className="font-medium text-[14px] text-[#201F1C] truncate group-hover:text-[#8C2F2F] transition-colors">{notebook.title}</span>
                            </Link>
                          </div>
                          <div className="col-span-2 text-[13px] text-[#6B6862]">{notebook.sourceCount} Sources</div>
                          <div className="col-span-2 text-[13px] text-[#6B6862]">{formatDate(notebook.created_at)}</div>
                          <div className="col-span-2 text-[13px] text-[#6B6862]">Owner</div>
                          <div className="col-span-1 flex justify-end relative" ref={openListDropdownId === notebook.id ? listDropdownRef : null}>
                            <button 
                              className="p-1.5 text-[#9C988E] hover:text-[#201F1C] hover:bg-[#E6E2D8] rounded-md transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setOpenListDropdownId(openListDropdownId === notebook.id ? null : notebook.id);
                              }}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            {openListDropdownId === notebook.id && (
                                <div className="absolute right-8 top-0 mt-1 w-40 bg-white border border-[#E6E2D8] rounded-lg shadow-lg py-1 z-20">
                                  <button 
                                    onClick={(e) => handleListAction(e, 'delete', notebook.id, notebook.title)}
                                    className="w-full text-left px-4 py-2 text-sm text-[#201F1C] hover:bg-[#F1EFE9] flex items-center gap-2"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-[#6B6862]" /> Delete
                                  </button>
                                  <button 
                                    onClick={(e) => handleListAction(e, 'edit', notebook.id, notebook.title)}
                                    className="w-full text-left px-4 py-2 text-sm text-[#201F1C] hover:bg-[#F1EFE9] flex items-center gap-2"
                                  >
                                    <Edit2 className="w-3.5 h-3.5 text-[#6B6862]" /> Edit title
                                  </button>
                                  <button 
                                    onClick={(e) => handleListAction(e, 'pin', notebook.id, notebook.title)}
                                    className="w-full text-left px-4 py-2 text-sm text-[#201F1C] hover:bg-[#F1EFE9] flex items-center gap-2"
                                  >
                                    <Pin className="w-3.5 h-3.5 text-[#6B6862]" /> Pin to top
                                  </button>
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

      </main>
    </div>
  );
}