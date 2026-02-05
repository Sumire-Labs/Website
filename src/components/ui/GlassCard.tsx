import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = "", hover = true }: GlassCardProps) {
  return (
    <div
      className={`
        glass-card p-6
        ${hover ? "" : "[&]:hover:transform-none [&]:hover:bg-[var(--bg-glass)]"}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
