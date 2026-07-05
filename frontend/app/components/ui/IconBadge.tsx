import { LucideIcon } from 'lucide-react';

interface IconBadgeProps {
  icon: LucideIcon;
  variant?: 'primary' | 'muted'; // 'primary' for Oxblood, 'muted' for grey
}

export function IconBadge({ icon: Icon, variant = 'primary' }: IconBadgeProps) {
  const isPrimary = variant === 'primary';
  return (
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
      isPrimary ? 'bg-oxblood-muted border-border-subtle' : 'bg-surface border-border-subtle'
    }`}>
      <Icon className={`w-4 h-4 ${isPrimary ? 'text-oxblood' : 'text-stone'}`} />
    </div>
  );
}