import { useState, ReactNode } from 'react';
import { Lock } from 'lucide-react';
import { Citation } from './types';

function CitationChip({ citation }: { citation: Citation }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const snippet = citation.snippet || '';
  const isLong = snippet.length > 140;
  const shown = expanded || !isLong ? snippet : `${snippet.slice(0, 140).trim()}…`;

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
        className="inline-flex items-center justify-center w-4 h-4 mx-0.5 -translate-y-[3px] rounded-full bg-border-subtle hover:bg-oxblood-muted text-[9px] font-semibold text-charcoal hover:text-oxblood transition-colors align-middle"
        aria-label={`Citation ${citation.index}: ${citation.sourceName}`}
      >
        {citation.index}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute z-40 left-0 top-6 w-64 bg-white border border-border-subtle rounded-lg shadow-lg p-3 text-left not-prose normal-case">
            <div className="flex items-center gap-1.5 mb-1.5 text-[11px] font-medium text-stone">
              <Lock className="w-3 h-3 shrink-0" />
              <span className="truncate">{citation.sourceName}</span>
            </div>
            <p className="text-[12.5px] text-charcoal leading-relaxed">{shown || 'No excerpt available.'}</p>
            {isLong && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setExpanded(v => !v); }}
                className="mt-1.5 text-[11px] text-oxblood font-medium hover:underline"
              >
                {expanded ? 'Show less' : '… show more'}
              </button>
            )}
          </div>
        </>
      )}
    </span>
  );
}

function injectCitations(children: ReactNode, citations?: Citation[]): ReactNode {
  if (!citations || citations.length === 0) return children;
  const map = new Map(citations.map(c => [c.index, c]));

  const walk = (node: ReactNode, key: string): ReactNode => {
    if (typeof node === 'string') {
      const regex = /\[(\d+)\]/g;
      const parts: ReactNode[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;
      let i = 0;
      while ((match = regex.exec(node)) !== null) {
        const idx = Number(match[1]);
        const citation = map.get(idx);
        if (!citation) continue;
        if (match.index > lastIndex) parts.push(node.slice(lastIndex, match.index));
        parts.push(<CitationChip key={`${key}-c-${i++}`} citation={citation} />);
        lastIndex = match.index + match[0].length;
      }
      if (parts.length === 0) return node;
      if (lastIndex < node.length) parts.push(node.slice(lastIndex));
      return parts;
    }
    if (Array.isArray(node)) {
      return node.map((child, i) => walk(child, `${key}-${i}`));
    }
    return node;
  };

  return walk(children, 'n');
}

export function citedMarkdownComponents(citations?: Citation[]) {
  return {
    p: ({ children }: { children?: ReactNode }) => <p>{injectCitations(children, citations)}</p>,
    li: ({ children }: { children?: ReactNode }) => <li>{injectCitations(children, citations)}</li>,
  };
}