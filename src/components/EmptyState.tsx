import { BrandRings } from "./BrandRings";

interface EmptyStateProps {
  title: string;
  subtitle: string;
}

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-divider bg-paper/60 px-6 py-16 text-center">
      <BrandRings className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 opacity-[0.09]" />
      <div className="relative">
        <p className="font-display text-lg font-semibold text-ink">{title}</p>
        <p className="mx-auto mt-1.5 max-w-xs text-sm text-ink-soft">{subtitle}</p>
      </div>
    </div>
  );
}
