"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Plus, MoreVertical, BookOpen, Clock, Trash2, Edit2, Pin } from 'lucide-react';

interface ArchiveCardProps {
  id?: string;
  isCreate?: boolean;
  title?: string;
  date?: string;
  sourceCount?: number;
  href?: string;
  onAction?: (action: 'delete' | 'edit' | 'pin', id: string, currentTitle: string) => void;
}

export function ArchiveCard({ id, isCreate, title, date, sourceCount, href = "/workspace", onAction }: ArchiveCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the link
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleActionClick = (e: React.MouseEvent, action: 'delete' | 'edit' | 'pin') => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(false);
    if (onAction && id && title) {
      onAction(action, id, title);
    }
  };

  if (isCreate) {
    return (
      <Link href={href} className="group flex flex-col items-center justify-center h-[180px] bg-[#FAF8F4] border border-dashed border-[#D8D4C8] rounded-xl hover:border-[#8C2F2F] hover:bg-[#F6EAE6]/50 transition-all cursor-pointer">
        <div className="w-10 h-10 rounded-full bg-[#E6E2D8] group-hover:bg-[#F6EAE6] flex items-center justify-center mb-3 transition-colors">
          <Plus className="w-5 h-5 text-[#6B6862] group-hover:text-[#8C2F2F]" />
        </div>
        <span className="text-[14px] font-medium text-[#201F1C] group-hover:text-[#8C2F2F] transition-colors">
          Create new archive
        </span>
      </Link>
    );
  }

  return (
    <Link href={href} className="group relative flex flex-col h-[180px] bg-white border border-[#E6E2D8] rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
      <div className="flex justify-between items-start mb-auto">
        <div className="w-9 h-9 rounded-lg bg-[#F6EAE6] flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-[#8C2F2F]" />
        </div>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            className="p-1 text-[#9C988E] hover:text-[#201F1C] transition-colors rounded-md hover:bg-[#F1EFE9]" 
            onClick={handleDropdownClick}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-40 bg-white border border-[#E6E2D8] rounded-lg shadow-lg py-1 z-10">
              <button 
                onClick={(e) => handleActionClick(e, 'delete')}
                className="w-full text-left px-4 py-2 text-sm text-[#201F1C] hover:bg-[#F1EFE9] flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5 text-[#6B6862]" /> Delete
              </button>
              <button 
                onClick={(e) => handleActionClick(e, 'edit')}
                className="w-full text-left px-4 py-2 text-sm text-[#201F1C] hover:bg-[#F1EFE9] flex items-center gap-2"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#6B6862]" /> Edit title
              </button>
              <button 
                onClick={(e) => handleActionClick(e, 'pin')}
                className="w-full text-left px-4 py-2 text-sm text-[#201F1C] hover:bg-[#F1EFE9] flex items-center gap-2"
              >
                <Pin className="w-3.5 h-3.5 text-[#6B6862]" /> Pin to top
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h3 className="font-medium text-[15px] text-[#201F1C] mb-3 line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-[11px] font-mono text-[#6B6862] border-t border-[#EFEDE6] pt-3">
          <Clock className="w-3 h-3" />
          {date} • {sourceCount} {sourceCount === 1 ? 'source' : 'sources'}
        </div>
      </div>
    </Link>
  );
}