import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Toast as ToastType } from './types';

export function Toast({ toast }: { toast: ToastType }) {
  return (
    <div
      role="status"
      className={`pointer-events-auto flex items-start gap-2.5 px-4 py-3 rounded-lg shadow-lg border text-[13px] bg-white transition-all ${
        toast.type === 'error' ? 'border-oxblood/25 text-oxblood' : 'border-border-subtle text-charcoal'
      }`}
    >
      {toast.type === 'error' ? (
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      ) : (
        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-oxblood" />
      )}
      <span className="leading-snug">{toast.message}</span>
    </div>
  );
}