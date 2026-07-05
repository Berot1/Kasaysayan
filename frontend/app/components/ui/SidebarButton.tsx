import { LucideIcon } from 'lucide-react';

interface SidebarButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export function SidebarButton({ icon: Icon, label, onClick, active }: SidebarButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
        active 
          ? 'bg-muted text-charcoal font-medium' 
          : 'text-stone hover:bg-surface hover:text-charcoal'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}