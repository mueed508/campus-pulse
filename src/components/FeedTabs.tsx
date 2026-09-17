"use client";

import { motion } from "framer-motion";

export type FeedTab = "now" | "upcoming";

interface FeedTabsProps {
  active: FeedTab;
  onChange: (tab: FeedTab) => void;
  nowCount: number;
  upcomingCount: number;
}

export function FeedTabs({ active, onChange, nowCount, upcomingCount }: FeedTabsProps) {
  const tabs: { key: FeedTab; label: string; count: number }[] = [
    { key: "now", label: "Happening Now", count: nowCount },
    { key: "upcoming", label: "Upcoming", count: upcomingCount },
  ];

  return (
    <div className="relative flex gap-1 rounded-full bg-paper p-1 ring-1 ring-divider">
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className="relative flex-1 whitespace-nowrap rounded-full px-2.5 py-2.5 text-[13px] font-semibold transition-colors sm:px-4 sm:text-sm"
          >
            {isActive && (
              <motion.span
                layoutId="active-tab"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span
              className={`relative z-10 inline-flex items-center gap-1.5 ${
                isActive ? "text-inverse" : "text-ink-soft"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                  isActive ? "bg-white/20" : "bg-divider text-ink-soft"
                }`}
              >
                {tab.count}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
