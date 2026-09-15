"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, Settings, User, Plus, Loader2, LogOut, 
  LayoutGrid, List, ChevronDown, MoreVertical, Trash2, Edit2, Pin, Globe 
} from 'lucide-react';
import { ArchiveCard } from '../components/ui/ArchiveCard';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

interface Archive {
  id: string;
  title: string;
  updated_at: string;
  created_at: string;
  pinned?: boolean | null;
  sourceCount?: number;
}

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data States
  const [archives, setArchives] = useState<Archive[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  
  // UI Controls States
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'title'>('recent');
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'featured'>('all');
  
  const router = useRouter();

  // Dropdown State management
  const [openListDropdownId, setOpenListDropdownId] = useState<string | null>(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const listDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (listDropdownRef.current && !listDropdownRef.current.contains(event.target as Node)) {
        setOpenListDropdownId(null);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // PERMANENT DATABASE ACTIONS
  const handleCardAction = async (action: 'delete' | 'edit' | 'pin', id: string, currentTitle: string) => {
    setOpenListDropdownId(null); 
    
    if (action === 'delete') {
      const confirmDelete = window.confirm(`Are you sure you want to delete "${currentTitle}"?`);
      if (confirmDelete) {
        const previousArchives = [...archives];
        setArchives(archives.filter(nb => nb.id !== id));
        
        try {
          const res = await fetch(`${BACKEND_URL}/api/archives/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${session?.access_token}` }
          });
          if (!res.ok) throw new Error("Delete failed");
        } catch (error) {
          console.error("Failed to delete:", error);
          setArchives(previousArchives);
          alert("Error: Could not delete the archive.");
        }
      }
    } else if (action === 'edit') {
      const newTitle = window.prompt("Enter new title:", currentTitle);
      if (newTitle && newTitle !== currentTitle) {
        const previousArchives = [...archives];
        setArchives(archives.map(nb => nb.id === id ? { ...nb, title: newTitle } : nb));
        
        try {
          const res = await fetch(`${BACKEND_URL}/api/archives/${id}`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session?.access_token}` 
            },
            body: JSON.stringify({ title: newTitle })
          });
          if (!res.ok) throw new Error("Update failed");
        } catch (error) {
          console.error("Failed to update:", error);
          setArchives(previousArchives);
          alert("Error: Could not rename the archive.");
        }
      }
    } else if (action === 'pin') {
      const archive = archives.find(nb => nb.id === id);
      const newPinnedStatus = !archive?.pinned; 
      const previousArchives = [...archives];

      setArchives(prev => prev.map(nb => nb.id === id ? { ...nb, pinned: newPinnedStatus } : nb));

      try {
        const res = await fetch(`${BACKEND_URL}/api/archives/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
          body: JSON.stringify({ pinned: newPinnedStatus })
        });
        if (!res.ok) throw new Error("Pinning failed");
      } catch (error) {
        console.error("Failed to toggle pin:", error);
        setArchives(previousArchives);
      }
    }
  };

  const handleListAction = (e: React.MouseEvent, action: 'delete' | 'edit' | 'pin', id: string, currentTitle: string) => {
    e.preventDefault();
    e.stopPropagation();
    handleCardAction(action, id, currentTitle);
  };

  const fetchArchives = useCallback(async (token: string) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/archives`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // CRITICAL: If unauthorized, force logout
    if (res.status === 401 || res.status === 403 || res.status === 500) {
      console.warn("Auth token invalid or expired. Signing out...");
      await supabase.auth.signOut();
      router.push('/auth');
      return;
    }

    if (res.ok) {
      const data = await res.json();
      
      // Default to 0 until the backend is updated to send the real count
      const dataWithRealSources = data.map((archive: Archive) => ({
        ...archive,
        sourceCount: archive.sourceCount || 0 
      }));
      setArchives(dataWithRealSources);
    }
  } catch (err) {
    console.error("Failed to fetch archives", err);
  }
  }, [router]);

  useEffect(() => {
  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/auth');
    } else {
      setSession(session);
      await fetchArchives(session.access_token);
    }
    setIsLoading(false);
  };
  checkAuth();
}, [router, fetchArchives]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleCreateArchive = async () => {
    if (!session) return;
    setIsCreating(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/archives`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      if (res.ok) {
        const newArchive = await res.json();
        router.push(`/archive/${newArchive.id}`);
      }
    } catch (err) {
      console.error(err);
      setIsCreating(false);
    }
  };

  const filteredAndSortedArchives = [...archives]
    .filter(nb => nb.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

  const pinnedArchives = filteredAndSortedArchives.filter(nb => Boolean(nb.pinned));
  const recentArchives = filteredAndSortedArchives.filter(nb => !Boolean(nb.pinned));

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
      
      <header className="border-b border-[#E6E2D8] bg-[#FAF8F4]">
        <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity min-w-0">
            <div className="relative h-8 w-8 sm:h-9 sm:w-9 shrink-0 overflow-hidden rounded-lg border border-[#E6E2D8] bg-[#FAF8F4] shadow-sm">
              <Image src="/logo1.png" alt="Kasaysayan logo" fill sizes="36px" className="object-cover" />
            </div>
            <span className="font-semibold text-[14px] sm:text-[15px] tracking-tight truncate">Kasaysayan</span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <button className="flex items-center gap-2 text-sm text-[#6B6862] hover:text-[#201F1C] transition-colors p-1.5 -m-1.5 sm:p-0 sm:m-0">
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
                <div className="absolute right-0 mt-2 w-52 sm:w-56 bg-white border border-[#E6E2D8] rounded-xl shadow-lg py-2 z-50">
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

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
        
        <div className="flex flex-col gap-4 mb-8 sm:mb-12">

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
               My Notebooks
             </button>
             <button 
               onClick={() => setActiveTab('featured')}
               className={`px-4 py-2 text-[13px] font-medium rounded-full whitespace-nowrap transition-colors ${activeTab === 'featured' ? 'bg-white border border-[#E6E2D8] shadow-sm text-[#201F1C]' : 'text-[#6B6862] hover:text-[#201F1C] hover:bg-[#E6E2D8]/30'}`}
             >
               Featured Notebooks
             </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 sm:gap-4">

            <div className="relative group w-full sm:w-56">
              <Search className="w-4 h-4 text-[#9C988E] absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#201F1C] transition-colors" />
              <input 
                type="text" 
                placeholder="Search notebooks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#E6E2D8] rounded-full outline-none focus:border-[#201F1C]/40 focus:shadow-sm transition-all"
              />
            </div>

            <div className="flex items-center gap-3">

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

              {/* NEW: Custom Styled Sort Dropdown */}
              <div className="relative shrink-0 flex-1 sm:flex-none" ref={sortDropdownRef}>
                <button 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center justify-between gap-2 text-sm font-medium text-[#201F1C] bg-white border border-[#E6E2D8] rounded-full px-4 py-2 hover:bg-[#F1EFE9] transition-colors w-full sm:w-auto sm:min-w-[135px]"
                >
                  <span className="truncate">{sortBy === 'recent' ? 'Most recent' : 'Title (A-Z)'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#6B6862] transition-transform shrink-0 ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-[#E6E2D8] rounded-xl shadow-lg py-1 z-30">
                    <button 
                      onClick={() => { setSortBy('recent'); setIsSortOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-[#F1EFE9] transition-colors ${sortBy === 'recent' ? 'text-[#8C2F2F] font-medium bg-[#F6EAE6]/50' : 'text-[#201F1C]'}`}
                    >
                      Most recent
                    </button>
                    <button 
                      onClick={() => { setSortBy('title'); setIsSortOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-[#F1EFE9] transition-colors ${sortBy === 'title' ? 'text-[#8C2F2F] font-medium bg-[#F6EAE6]/50' : 'text-[#201F1C]'}`}
                    >
                      Title (A-Z)
                    </button>
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleCreateArchive}
                disabled={isCreating}
                aria-label="Create new"
                className="flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-black disabled:bg-[#6B6862] text-white w-10 h-10 sm:w-auto sm:h-auto sm:px-5 sm:py-2.5 rounded-full text-[13px] font-medium transition-colors shrink-0"
              >
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span className="hidden sm:inline">Create new</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- 1. FEATURED ARCHIVES SECTION --- */}
        {(activeTab === 'featured' || (activeTab === 'all' && pinnedArchives.length === 0)) && !searchQuery && (
          <section className="mb-16">
            <h2 className="text-[22px] text-[#201F1C] mb-6">
              Featured Notebooks
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
                <div className="hidden sm:grid sm:grid-cols-12 gap-4 pb-3 border-b border-[#E6E2D8] text-[13px] font-medium text-[#201F1C] px-2">
                  <div className="col-span-5">Title</div>
                  <div className="col-span-2">Sources</div>
                  <div className="col-span-2">Created</div>
                  <div className="col-span-2">Role</div>
                  <div className="col-span-1"></div>
                </div>
                
                <div className="flex flex-col">
                  <div className="group relative flex flex-col gap-1.5 sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center py-3.5 sm:py-4 border-b border-[#EFEDE6] hover:bg-[#F1EFE9]/50 transition-colors px-2 cursor-pointer">
                    <div className="sm:col-span-5 flex items-center gap-3">
                      <div className="w-6 h-6 shrink-0 bg-[#F1EFE9] rounded flex items-center justify-center overflow-hidden">
                        <Image src="https://commons.wikimedia.org/wiki/Special:FilePath/Jose_Rizal_full.jpg?width=100" alt="Rizal" width={24} height={24} className="object-cover opacity-80 mix-blend-multiply" unoptimized />
                      </div>
                      <span className="font-medium text-[14px] text-[#201F1C] truncate group-hover:text-[#8C2F2F] transition-colors">Noli Me Tangere</span>
                    </div>
                    <div className="text-[12px] text-[#6B6862] flex items-center gap-1.5 sm:hidden pl-9">
                      12 Sources <span aria-hidden="true">•</span> Jul 5, 2026 <span aria-hidden="true">•</span> <Globe className="w-3 h-3" /> Reader
                    </div>
                    <div className="hidden sm:block sm:col-span-2 text-[13px] text-[#6B6862]">12 Sources</div>
                    <div className="hidden sm:block sm:col-span-2 text-[13px] text-[#6B6862]">Jul 5, 2026</div>
                    <div className="hidden sm:flex sm:col-span-2 text-[13px] text-[#6B6862] items-center gap-2">
                      <Globe className="w-3.5 h-3.5" /> Reader
                    </div>
                    <div className="hidden sm:block sm:col-span-1"></div>
                  </div>

                  <div className="group relative flex flex-col gap-1.5 sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center py-3.5 sm:py-4 border-b border-[#EFEDE6] hover:bg-[#F1EFE9]/50 transition-colors px-2 cursor-pointer">
                    <div className="sm:col-span-5 flex items-center gap-3">
                      <div className="w-6 h-6 shrink-0 bg-[#F6EAE6] rounded flex items-center justify-center overflow-hidden">
                        <Image src="https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Katipunan.svg?width=100" alt="Katipunan" width={24} height={24} className="object-cover opacity-80 mix-blend-multiply" unoptimized />
                      </div>
                      <span className="font-medium text-[14px] text-[#201F1C] truncate group-hover:text-[#8C2F2F] transition-colors">Katipunan Records</span>
                    </div>
                    <div className="text-[12px] text-[#6B6862] flex items-center gap-1.5 sm:hidden pl-9">
                      8 Sources <span aria-hidden="true">•</span> Jun 12, 2026 <span aria-hidden="true">•</span> <Globe className="w-3 h-3" /> Reader
                    </div>
                    <div className="hidden sm:block sm:col-span-2 text-[13px] text-[#6B6862]">8 Sources</div>
                    <div className="hidden sm:block sm:col-span-2 text-[13px] text-[#6B6862]">Jun 12, 2026</div>
                    <div className="hidden sm:flex sm:col-span-2 text-[13px] text-[#6B6862] items-center gap-2">
                      <Globe className="w-3.5 h-3.5" /> Reader
                    </div>
                    <div className="hidden sm:block sm:col-span-1"></div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
        {/* --- 1. PINNED ARCHIVES SECTION --- */}
        {pinnedArchives.length > 0 && !searchQuery && activeTab !== 'featured' && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Pin className="w-5 h-5 text-[#8C2F2F]" />
              <h2 className="text-[22px] text-[#201F1C]">Pinned</h2>
            </div>
            <div className={`gap-5 ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'flex flex-col'}`}>
              {pinnedArchives.map(archive => (
                <ArchiveCard 
                  key={archive.id}
                  {...archive}
                  pinned={Boolean(archive.pinned)}
                  date={formatDate(archive.updated_at)}
                  href={`/archive/${archive.id}`}
                  onAction={handleCardAction}
                />
              ))}
            </div>
          </section>
        )}

        {/* --- 2. RECENT ARCHIVES SECTION --- */}
        {(activeTab === 'all' || activeTab === 'my') && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] text-[#201F1C]">
                Recent notebooks
              </h2>
              {searchQuery && (
                <span className="text-sm font-medium text-[#8C2F2F] bg-[#F6EAE6] px-3 py-1 rounded-full">
                  {recentArchives.length} results for &quot;{searchQuery}&quot;
                </span>
              )}
            </div>

            {recentArchives.length === 0 ? (
              <div className="w-full py-16 flex flex-col items-center justify-center border border-dashed border-[#D8D4C8] rounded-xl bg-white/50">
                <p className="text-[#6B6862] mb-4 text-sm">
                  {searchQuery ? "No archives match your search." : "You haven't created any archives yet."}
                </p>
                {!searchQuery && (
                  <button 
                    onClick={handleCreateArchive}
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
                  <div onClick={handleCreateArchive} className="cursor-pointer">
                    <ArchiveCard isCreate href="#" />
                  </div>
                )}

                {viewMode === 'grid' ? (
                    recentArchives.map(archive => (
                      <ArchiveCard 
                        key={archive.id}
                        id={archive.id}
                        title={archive.title} 
                        date={formatDate(archive.updated_at)} 
                        sourceCount={archive.sourceCount} 
                        href={`/archive/${archive.id}`}
                        onAction={handleCardAction}
                      />
                    ))
                ) : (
                  // RECENT LIST VIEW
                  <div className="w-full">
                    <div className="hidden sm:grid sm:grid-cols-12 gap-4 pb-3 border-b border-[#E6E2D8] text-[13px] font-medium text-[#201F1C] px-2">
                      <div className="col-span-5">Title</div>
                      <div className="col-span-2">Sources</div>
                      <div className="col-span-2">Created</div>
                      <div className="col-span-2">Role</div>
                      <div className="col-span-1"></div>
                    </div>
                    
                    <div className="flex flex-col">
                      {filteredAndSortedArchives.map(archive => (
                        <div key={archive.id} className="group relative flex flex-col gap-1.5 sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center py-3.5 sm:py-4 border-b border-[#EFEDE6] hover:bg-[#F1EFE9]/50 transition-colors px-2">
                          <div className="flex items-center justify-between gap-2 sm:contents">
                            <div className="sm:col-span-5 flex items-center gap-3 min-w-0">
                              <Link href={`/archive/${archive.id}`} className="flex items-center gap-3 w-full min-w-0">
                              <div className="w-6 h-6 shrink-0 flex items-center justify-center text-[#8C2F2F]">
                                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                              <span className="font-medium text-[14px] text-[#201F1C] truncate group-hover:text-[#8C2F2F] transition-colors">{archive.title}</span>
                              </Link>
                            </div>
                            <div className="sm:hidden shrink-0 relative" ref={openListDropdownId === archive.id ? listDropdownRef : null}>
                              <button 
                                className="p-1.5 text-[#9C988E] hover:text-[#201F1C] hover:bg-[#E6E2D8] rounded-md transition-colors"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setOpenListDropdownId(openListDropdownId === archive.id ? null : archive.id);
                                }}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              {openListDropdownId === archive.id && (
                                  <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-[#E6E2D8] rounded-lg shadow-lg py-1 z-20">
                                    <button 
                                      onClick={(e) => handleListAction(e, 'delete', archive.id, archive.title)}
                                      className="w-full text-left px-4 py-2 text-sm text-[#201F1C] hover:bg-[#F1EFE9] flex items-center gap-2"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-[#6B6862]" /> Delete
                                    </button>
                                    <button 
                                      onClick={(e) => handleListAction(e, 'edit', archive.id, archive.title)}
                                      className="w-full text-left px-4 py-2 text-sm text-[#201F1C] hover:bg-[#F1EFE9] flex items-center gap-2"
                                    >
                                      <Edit2 className="w-3.5 h-3.5 text-[#6B6862]" /> Edit title
                                    </button>
                                    <button 
                                      onClick={(e) => handleListAction(e, 'pin', archive.id, archive.title)}
                                      className="w-full text-left px-4 py-2 text-sm text-[#201F1C] hover:bg-[#F1EFE9] flex items-center gap-2"
                                    >
                                      <Pin className="w-3.5 h-3.5 text-[#6B6862]" /> Pin to top
                                    </button>
                                  </div>
                                )}
                            </div>
                          </div>
                          <div className="text-[12px] text-[#6B6862] flex items-center gap-1.5 sm:hidden pl-9">
                            {archive.sourceCount} Sources <span aria-hidden="true">•</span> {formatDate(archive.created_at)} <span aria-hidden="true">•</span> Owner
                          </div>
                          <div className="hidden sm:block sm:col-span-2 text-[13px] text-[#6B6862]">{archive.sourceCount} Sources</div>
                          <div className="hidden sm:block sm:col-span-2 text-[13px] text-[#6B6862]">{formatDate(archive.created_at)}</div>
                          <div className="hidden sm:block sm:col-span-2 text-[13px] text-[#6B6862]">Owner</div>
                          <div className="hidden sm:flex sm:col-span-1 justify-end relative" ref={openListDropdownId === archive.id ? listDropdownRef : null}>
                            <button 
                              className="p-1.5 text-[#9C988E] hover:text-[#201F1C] hover:bg-[#E6E2D8] rounded-md transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setOpenListDropdownId(openListDropdownId === archive.id ? null : archive.id);
                              }}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            {openListDropdownId === archive.id && (
                                <div className="absolute right-8 top-0 mt-1 w-40 bg-white border border-[#E6E2D8] rounded-lg shadow-lg py-1 z-20">
                                  <button 
                                    onClick={(e) => handleListAction(e, 'delete', archive.id, archive.title)}
                                    className="w-full text-left px-4 py-2 text-sm text-[#201F1C] hover:bg-[#F1EFE9] flex items-center gap-2"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-[#6B6862]" /> Delete
                                  </button>
                                  <button 
                                    onClick={(e) => handleListAction(e, 'edit', archive.id, archive.title)}
                                    className="w-full text-left px-4 py-2 text-sm text-[#201F1C] hover:bg-[#F1EFE9] flex items-center gap-2"
                                  >
                                    <Edit2 className="w-3.5 h-3.5 text-[#6B6862]" /> Edit title
                                  </button>
                                  <button 
                                    onClick={(e) => handleListAction(e, 'pin', archive.id, archive.title)}
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