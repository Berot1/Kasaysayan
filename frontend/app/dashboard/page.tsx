"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Settings, Landmark, User, Plus, Loader2, LogOut } from 'lucide-react';
import { ArchiveCard } from '../components/ui/ArchiveCard';

const BACKEND_URL = 'http://127.0.0.1:8000';

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
      } else {
        setSession(session);
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

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center bg-[#FAF8F4] text-[#201F1C]"><Loader2 className="animate-spin w-8 h-8" /></div>;
  }

  const avatarUrl = session?.user.user_metadata?.avatar_url;
  const fullName = session?.user.user_metadata?.full_name || 'Researcher';

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#201F1C] font-sans selection:bg-[#F1E2B8]">
      
      {/* Top Navigation */}
      <header className="border-b border-[#E6E2D8] bg-[#FAF8F4]">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
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
            
            {/* User Account Dropdown */}
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

      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-[13px] font-medium bg-white border border-[#E6E2D8] shadow-sm text-[#201F1C] rounded-md">All archives</button>
            <button className="px-4 py-2 text-[13px] font-medium text-[#6B6862] hover:text-[#201F1C] hover:bg-[#E6E2D8]/30 rounded-md transition-colors">My archives</button>
            <button className="px-4 py-2 text-[13px] font-medium text-[#6B6862] hover:text-[#201F1C] hover:bg-[#E6E2D8]/30 rounded-md transition-colors">Featured</button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="w-4 h-4 text-[#9C988E] absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#201F1C] transition-colors" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full sm:w-56 pl-9 pr-4 py-2 text-sm bg-white border border-[#E6E2D8] rounded-md outline-none focus:border-[#201F1C]/40 focus:shadow-sm transition-all"
              />
            </div>
            
            <button 
              onClick={handleCreateNotebook}
              disabled={isCreating}
              className="flex items-center gap-2 bg-[#201F1C] hover:bg-black disabled:bg-[#6B6862] text-[#FAF8F4] px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              New
            </button>
          </div>
        </div>

        {/* Featured Section */}
        <section className="mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#9C988E] mb-6">
            Featured Collections
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Link href="/workspace" className="bg-white border border-[#E6E2D8] rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="relative h-28 bg-[#F1EFE9] flex items-center justify-center overflow-hidden">
                <Image src="https://commons.wikimedia.org/wiki/Special:FilePath/Jose_Rizal_full.jpg?width=400" alt="Rizal" fill className="object-cover opacity-90 mix-blend-multiply" unoptimized />
              </div>
              <div className="p-4">
                <span className="font-mono text-[10px] text-[#9C988E] uppercase tracking-wider mb-1 block">Literature</span>
                <p className="text-[15px] font-medium text-[#201F1C]">Noli Me Tangere</p>
                <p className="text-[11px] font-mono text-[#6B6862] mt-2 border-t border-[#EFEDE6] pt-2">Jul 5, 2026 • 12 sources</p>
              </div>
            </Link>
            <Link href="/workspace" className="bg-white border border-[#E6E2D8] rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="relative h-28 bg-[#F6EAE6] flex items-center justify-center overflow-hidden">
                <Image src="https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Katipunan.svg?width=400" alt="Katipunan" fill className="object-cover opacity-80 mix-blend-multiply" unoptimized />
              </div>
              <div className="p-4">
                <span className="font-mono text-[10px] text-[#9C988E] uppercase tracking-wider mb-1 block">Revolution</span>
                <p className="text-[15px] font-medium text-[#201F1C]">Katipunan Records</p>
                <p className="text-[11px] font-mono text-[#6B6862] mt-2 border-t border-[#EFEDE6] pt-2">Jun 12, 2026 • 8 sources</p>
              </div>
            </Link>
            <Link href="/workspace" className="bg-white border border-[#E6E2D8] rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
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
        </section>

        {/* Recent Section */}
        <section>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#9C988E] mb-6">
            Recent Archives
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <ArchiveCard isCreate />
            <ArchiveCard title="Malolos Constitution Drafts" date="Jul 4, 2026" sourceCount={4} />
            <ArchiveCard title="Personal Letters of Antonio Luna" date="Jun 28, 2026" sourceCount={14} />
            <ArchiveCard title="La Solidaridad Transcripts" date="Jun 15, 2026" sourceCount={82} />
          </div>
        </section>

      </main>
    </div>
  );
}