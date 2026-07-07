export function genId(): string {
  return `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function deriveNoteTitle(content: string): string {
  const firstLine = content.split('\n').map(l => l.trim()).find(l => l.length > 0);
  if (!firstLine) return 'Untitled note';
  const cleaned = firstLine.replace(/^#+\s*/, '').replace(/\*\*/g, '').replace(/\[(\d+)\]/g, '').trim();
  return cleaned.length > 80 ? `${cleaned.slice(0, 80).trim()}…` : cleaned;
}