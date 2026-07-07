import { ArrowLeft, Save, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface ArchiveHeaderProps {
  title: string;
  setTitle: (v: string) => void;
  isSaving: boolean;
  isDirty: boolean;
  lastSavedAt: Date | null;
  onSave: () => void;
}

export function ArchiveHeader({
  title,
  setTitle,
  isSaving,
  isDirty,
  lastSavedAt,
  onSave,
}: ArchiveHeaderProps) {
  const saveStatus = (
    <span className="hidden sm:flex items-center gap-1.5 text-[12px] text-stone">
      {isSaving ? (
        <><Loader2 className="w-3 h-3 animate-spin" /> Saving…</>
      ) : isDirty ? (
        <><span className="w-1.5 h-1.5 rounded-full bg-oxblood inline-block" /> Unsaved changes</>
      ) : lastSavedAt ? (
        <><CheckCircle2 className="w-3.5 h-3.5" /> All changes saved</>
      ) : null}
    </span>
  );

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-border-subtle bg-ivory shrink-0 z-10 gap-3">
      <div className="flex items-center gap-3 md:gap-4 min-w-0">
        <Link href="/dashboard" className="p-2 -ml-2 text-stone hover:text-charcoal hover:bg-surface rounded-md transition-colors shrink-0" aria-label="Back to dashboard">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="w-px h-4 bg-border-strong shrink-0"></div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Archive title"
          className="font-display font-medium text-lg bg-transparent outline-none border-b border-transparent focus:border-charcoal/30 w-40 sm:w-64 md:w-96 truncate rounded-sm"
        />
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {saveStatus}
        <button
          onClick={onSave}
          disabled={isSaving || !isDirty}
          className="flex items-center gap-2 bg-charcoal hover:bg-black disabled:bg-stone disabled:opacity-50 text-background px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving...' : 'Save draft'}
        </button>
      </div>
    </header>
  );
}