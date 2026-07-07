import { FileText, FileImage, X } from 'lucide-react';
import { ArchiveSource } from './types';

export function SourcePreviewModal({
  source,
  onClose,
}: {
  source: ArchiveSource | null;
  onClose: () => void;
}) {
  if (!source) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 backdrop-blur-sm p-4 md:p-8" onClick={onClose}>
      <div
        className="bg-white w-full max-w-6xl h-full rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-border-subtle"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={source.name}
      >
        <div className="flex items-center justify-between p-4 border-b border-border-subtle bg-ivory shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-muted rounded-lg shrink-0">
              {source.type === 'application/pdf' ? (
                <FileText className="w-5 h-5 text-oxblood" />
              ) : (
                <FileImage className="w-5 h-5 text-stone" />
              )}
            </div>
            <h3 className="font-medium text-charcoal text-[15px] truncate">{source.name}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md transition-colors text-stone hover:text-charcoal shrink-0" aria-label="Close preview">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 bg-[#F1EFE9] overflow-hidden">
          {source.type === 'application/pdf' ? (
            <iframe src={`${source.url}#toolbar=0`} className="w-full h-full border-none" title="PDF Viewer" />
          ) : source.type.startsWith('image/') ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={source.url} alt={source.name} className="w-full h-full object-contain p-4" />
          ) : (
            <div className="w-full h-full overflow-y-auto p-12 bg-white">
              <pre className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed max-w-3xl mx-auto">
                {source.rawText || 'Text preview not available.'}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}