"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Search, Settings, Landmark, User, Plus } from 'lucide-react';
import { ArchiveCard } from '../components/ui/ArchiveCard';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#201F1C] font-sans selection:bg-[#F1E2B8]">
      
      {/* Top Navigation - Matched to app/page.tsx */}
      <header className="border-b border-[#E6E2D8] bg-[#FAF8F4]">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#8C2F2F] flex items-center justify-center">
              <Landmark className="w-4 h-4 text-[#FAF8F4]" />
            </div>
            <span className="font-semibold text-[15px] tracking-tight">Kasaysayan</span>
          </div>

          <div className="flex items-center gap-5">
            <button className="flex items-center gap-2 text-sm text-[#6B6862] hover:text-[#201F1C] transition-colors">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>
            <div className="w-7 h-7 rounded-full border border-[#E6E2D8] bg-white flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#201F1C] transition-colors">
              <User className="w-3.5 h-3.5 text-[#6B6862]" />
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          
          {/* Tabs */}
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-[13px] font-medium bg-white border border-[#E6E2D8] shadow-sm text-[#201F1C] rounded-md">All archives</button>
            <button className="px-4 py-2 text-[13px] font-medium text-[#6B6862] hover:text-[#201F1C] hover:bg-[#E6E2D8]/30 rounded-md transition-colors">My archives</button>
            <button className="px-4 py-2 text-[13px] font-medium text-[#6B6862] hover:text-[#201F1C] hover:bg-[#E6E2D8]/30 rounded-md transition-colors">Featured</button>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative group">
              <Search className="w-4 h-4 text-[#9C988E] absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#201F1C] transition-colors" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full sm:w-56 pl-9 pr-4 py-2 text-sm bg-white border border-[#E6E2D8] rounded-md outline-none focus:border-[#201F1C]/40 focus:shadow-sm transition-all"
              />
            </div>
            
            <Link href="/workspace" className="flex items-center gap-2 bg-[#201F1C] hover:bg-black text-[#FAF8F4] px-4 py-2 rounded-md text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" />
              New
            </Link>
          </div>
        </div>

        {/* Featured Section - Matched to 'Source types strip' from app/page.tsx */}
        <section className="mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#9C988E] mb-6">
            Featured Collections
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Featured Card 1 */}
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

            {/* Featured Card 2 */}
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

            {/* Featured Card 3 */}
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