"use client";

import { useEffect, useRef, useState } from "react";
import { fetchEvents } from "@/lib/events/api";
import { CampusEvent } from "@/lib/events/types";

const POLL_INTERVAL_MS = 12000;

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

    async function poll() {
      try {
        const data = await fetchEvents();
        if (cancelled) return;

        const incomingIds = data.map((e) => e.id);
        const newIds = incomingIds.filter((id) => !knownIds.current.has(id));
        if (knownIds.current.size > 0 && newIds.length > 0) {
          setNewestId(newIds[newIds.length - 1]);
        }
        knownIds.current = new Set(incomingIds);

        setEvents(data);
        setError(null);
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load events");
          setLoading(false);
        }
      }
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { events, loading, error, newestId, now };
}
