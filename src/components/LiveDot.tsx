export function LiveDot({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-flex h-2.5 w-2.5 ${className}`}>
      <span className="absolute inline-flex h-full w-full rounded-full bg-secondary animate-pulse-live" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-secondary" />
    </span>
  );
}
