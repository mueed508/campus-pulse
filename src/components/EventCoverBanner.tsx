"use client";

import { useState } from "react";
import { CampusEvent } from "@/lib/supabase/types";
import { SPORT_KIND_META } from "@/lib/sportKinds";
import { ImageLightbox } from "./ImageLightbox";
import { ExpandIcon } from "./icons";

export function EventCoverBanner({ event }: { event: CampusEvent }) {
  const [expanded, setExpanded] = useState(false);

  if (event.imageUrl) {
    const imageUrl = event.imageUrl;
    return (
      <>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label="View full event graphic"
          className="group/banner relative block h-56 w-full cursor-zoom-in overflow-hidden bg-ink sm:h-64"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt=""
            className="relative h-full w-full object-contain"
            loading="lazy"
          />
          <span className="absolute right-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1.5 text-xs font-medium text-white transition-colors group-hover/banner:bg-black/70">
            <ExpandIcon className="h-3.5 w-3.5" />
            View full size
          </span>
        </button>
        <ImageLightbox src={expanded ? imageUrl : null} onClose={() => setExpanded(false)} />
      </>
    );
  }

  if (event.type === "sports" && event.sportKind) {
    const meta = SPORT_KIND_META[event.sportKind];
    return (
      <div
        className="flex h-32 w-full items-center justify-center sm:h-36"
        style={{ background: meta.gradient }}
      >
        <meta.Icon className="h-14 w-14 text-white/90" />
      </div>
    );
  }

  return null;
}
