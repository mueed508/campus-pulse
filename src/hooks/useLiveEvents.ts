"use client";

import { useEffect, useRef, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { fetchEvents } from "@/lib/supabase/events";
import { MOCK_EVENTS } from "@/lib/mockEvents";
import { CampusEvent, EventRow, rowToEvent } from "@/lib/supabase/types";

interface UseLiveEventsResult {
  events: CampusEvent[];
  loading: boolean;
  error: string | null;
  newestId: string | null;
  now: Date;
}

export function useLiveEvents(): UseLiveEventsResult {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newestId, setNewestId] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());
  const knownIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!isSupabaseConfigured) {
        if (!cancelled) {
          setEvents(MOCK_EVENTS);
          knownIds.current = new Set(MOCK_EVENTS.map((e) => e.id));
          setLoading(false);
        }
        return;
      }
      try {
        const data = await fetchEvents();
        if (!cancelled) {
          setEvents(data);
          knownIds.current = new Set(data.map((e) => e.id));
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load events");
          setLoading(false);
        }
      }
    }

    load();

    if (!isSupabaseConfigured) return () => {
      cancelled = true;
    };

    const channel = supabase
      .channel("events-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "events" },
        (payload) => {
          const incoming = rowToEvent(payload.new as EventRow);
          if (knownIds.current.has(incoming.id)) return;
          knownIds.current.add(incoming.id);
          setNewestId(incoming.id);
          setEvents((prev) =>
            [...prev, incoming].sort(
              (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
            )
          );
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return { events, loading, error, newestId, now };
}
