import { type ReactNode } from "react";

interface SectionHeaderProps {
  title: ReactNode;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors shrink-0"
        >
          {action.label} →
        </button>
      )}
    </div>
  );
}
