import { SPORT_KIND_META, SPORT_KINDS, SportKind } from "@/lib/sportKinds";

interface SportKindPickerProps {
  value: SportKind;
  onChange: (kind: SportKind) => void;
}

export function SportKindPicker({ value, onChange }: SportKindPickerProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-ink">Which sport?</label>
      <div className="grid grid-cols-4 gap-2">
        {SPORT_KINDS.map((kind) => {
          const meta = SPORT_KIND_META[kind];
          const isActive = value === kind;
          return (
            <button
              key={kind}
              type="button"
              onClick={() => onChange(kind)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-semibold transition ${
                isActive
                  ? "border-primary bg-primary text-inverse"
                  : "border-divider bg-white text-ink-soft"
              }`}
            >
              <meta.Icon className="h-5 w-5" />
              {meta.label}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-ink-soft">
        Auto-picks a graphic for the card. Add your own below to override it.
      </p>
    </div>
  );
}
