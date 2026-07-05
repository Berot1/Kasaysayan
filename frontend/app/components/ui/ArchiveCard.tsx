import Link from 'next/link';
import { Plus, MoreVertical, BookOpen, Clock } from 'lucide-react';

interface ArchiveCardProps {
  isCreate?: boolean;
  title?: string;
  date?: string;
  sourceCount?: number;
  href?: string;
}

export function ArchiveCard({ isCreate, title, date, sourceCount, href = "/workspace" }: ArchiveCardProps) {
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
        {/* Styled exactly like the red icons in app/page.tsx */}
        <div className="w-9 h-9 rounded-lg bg-[#F6EAE6] flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-[#8C2F2F]" />
        </div>
        <button className="p-1 text-[#9C988E] hover:text-[#201F1C] transition-colors" onClick={(e) => e.preventDefault()}>
          <MoreVertical className="w-4 h-4" />
        </button>
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