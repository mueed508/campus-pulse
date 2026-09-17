"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLiveEvents } from "@/hooks/useLiveEvents";
import { splitEvents, groupByDay } from "@/lib/time";
import { EventCard } from "./EventCard";
import { EmptyState } from "./EmptyState";
import { FeedTabs, FeedTab } from "./FeedTabs";
import { Header } from "./Header";

export function Feed() {
  const { events, loading, error, newestId, now } = useLiveEvents();
  const [tab, setTab] = useState<FeedTab>("now");

  const { nowEvents, upcomingEvents } = splitEvents(events, now);
  const dayGroups = groupByDay(upcomingEvents, now);

  return (
    <div className="flex min-h-screen flex-col">
      <Header liveCount={nowEvents.length} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-6 sm:px-8">
        <FeedTabs
          active={tab}
          onChange={setTab}
          nowCount={nowEvents.length}
          upcomingCount={upcomingEvents.length}
        />

        <div className="mt-6">
          {loading && (
            <div className="flex flex-col gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-2xl bg-paper ring-1 ring-divider"
                />
              ))}
            </div>
          )}

          {!loading && error && (
            <EmptyState
              title="Couldn't load the feed"
              subtitle="Check your connection and try again."
            />
          )}

          {!loading && !error && (
            <AnimatePresence mode="wait">
              {tab === "now" ? (
                <motion.div
                  key="now"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {nowEvents.length === 0 ? (
                    <EmptyState
                      title="Nothing's happening right now"
                      subtitle="Check back soon, or be the first to post something."
                    />
                  ) : (
                    <div className="flex flex-col gap-3">
                      <AnimatePresence initial={false}>
                        {nowEvents.map((event) => (
                          <EventCard
                            key={event.id}
                            event={event}
                            now={now}
                            variant="now"
                            isNew={event.id === newestId}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="upcoming"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {upcomingEvents.length === 0 ? (
                    <EmptyState
                      title="Nothing on the calendar yet"
                      subtitle="Societies and sports events will show up here once they're posted."
                    />
                  ) : (
                    <div className="flex flex-col gap-6">
                      {dayGroups.map((group) => (
                        <div key={group.label}>
                          <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-ink-soft">
                            {group.label}
                          </p>
                          <div className="flex flex-col gap-3">
                            {group.events.map((event) => (
                              <EventCard
                                key={event.id}
                                event={event}
                                now={now}
                                variant="upcoming"
                                isNew={event.id === newestId}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>

      <footer className="px-5 py-6 text-center text-xs text-ink-soft sm:px-8">
        Campus Pulse · built for COMSATS Lahore
      </footer>
    </div>
  );
}
