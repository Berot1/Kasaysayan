import { Loader2, FileText } from 'lucide-react';

interface DocumentCardProps {
  name: string;
  status: 'loading' | 'ready' | 'error';
}

export function DocumentCard({ name, status }: DocumentCardProps) {
  return (
    <div className="group flex items-start gap-3 p-3 bg-surface rounded-md border border-border-subtle shadow-sm hover:border-stone/30 transition-all cursor-default">
      <div className={`mt-0.5 shrink-0 ${status === 'ready' ? 'text-oxblood' : 'text-stone'}`}>
        {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-charcoal leading-tight truncate">{name}</p>
        <p className="text-[11px] font-mono text-stone mt-1 capitalize">{status}</p>
      </div>
    </div>
  );
}