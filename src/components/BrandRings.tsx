interface BrandRingsProps {
  className?: string;
  tone?: "brand" | "mono";
}

export function BrandRings({ className, tone = "brand" }: BrandRingsProps) {
  const outer = tone === "brand" ? "var(--cui-primary-light)" : "currentColor";
  const inner = tone === "brand" ? "var(--cui-secondary-light)" : "currentColor";

  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true">
      <circle cx="92" cy="100" r="86" stroke={outer} strokeWidth="13" />
      <circle cx="126" cy="100" r="48" stroke={inner} strokeWidth="13" />
    </svg>
  );
}
